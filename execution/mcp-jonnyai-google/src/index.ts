import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { google } from "googleapis";
import * as fs from "fs";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import * as path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

// ── Config ────────────────────────────────────────────────────────────────────

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET!;
const TOKEN_PATH = path.resolve(__dirname, "../tokens.json");
const REDIRECT_URI = "http://localhost:3099/oauth/callback";

const SCOPES = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/documents",
  "https://www.googleapis.com/auth/presentations",
  "https://www.googleapis.com/auth/tasks",
  "https://www.googleapis.com/auth/contacts",
  "https://www.googleapis.com/auth/analytics.readonly",
];

// ── Auth helpers ──────────────────────────────────────────────────────────────

function getOAuthClient() {
  return new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI);
}

function loadTokens(): Record<string, any> | null {
  try {
    if (fs.existsSync(TOKEN_PATH)) return JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
  } catch {}
  return null;
}

function getAuthedClient() {
  const tokens = loadTokens();
  if (!tokens) throw new Error("Not authenticated. Call google_auth_url, open the URL, authorize, then call google_auth_exchange with the code from the redirect URL.");
  const client = getOAuthClient();
  client.setCredentials(tokens);
  return client;
}

// ── Gemini ────────────────────────────────────────────────────────────────────

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function geminiGenerate(prompt: string, model = "gemini-2.0-flash"): Promise<string> {
  const m = genAI.getGenerativeModel({ model });
  const result = await m.generateContent(prompt);
  return result.response.text();
}

async function geminiChat(history: { role: string; parts: string }[], message: string, model = "gemini-2.0-flash"): Promise<string> {
  const m = genAI.getGenerativeModel({ model });
  const chat = m.startChat({ history: history.map((h) => ({ role: h.role, parts: [{ text: h.parts }] })) });
  const result = await chat.sendMessage(message);
  return result.response.text();
}

// ── Drive ─────────────────────────────────────────────────────────────────────

async function driveListFiles(query = "", maxResults = 20) {
  const drive = google.drive({ version: "v3", auth: getAuthedClient() });
  const res = await drive.files.list({ q: query || undefined, pageSize: maxResults, fields: "files(id,name,mimeType,size,modifiedTime,parents,webViewLink)" });
  return res.data.files ?? [];
}

async function driveReadFile(fileId: string) {
  const drive = google.drive({ version: "v3", auth: getAuthedClient() });
  const meta = await drive.files.get({ fileId, fields: "name,mimeType" });
  const mimeType = meta.data.mimeType ?? "";
  if (mimeType === "application/vnd.google-apps.document") {
    const ex = await drive.files.export({ fileId, mimeType: "text/plain" }, { responseType: "text" });
    return { name: meta.data.name, content: ex.data as string };
  }
  if (mimeType === "application/vnd.google-apps.spreadsheet") {
    const ex = await drive.files.export({ fileId, mimeType: "text/csv" }, { responseType: "text" });
    return { name: meta.data.name, content: ex.data as string };
  }
  const res = await drive.files.get({ fileId, alt: "media" }, { responseType: "text" });
  return { name: meta.data.name, content: res.data as string };
}

async function driveSearch(query: string, maxResults = 20) {
  const drive = google.drive({ version: "v3", auth: getAuthedClient() });
  const res = await drive.files.list({ q: `name contains '${query.replace(/'/g, "\\'")}' and trashed = false`, pageSize: maxResults, fields: "files(id,name,mimeType,size,modifiedTime,webViewLink)" });
  return res.data.files ?? [];
}

async function driveCreateFolder(name: string, parentId?: string) {
  const drive = google.drive({ version: "v3", auth: getAuthedClient() });
  const res = await drive.files.create({ requestBody: { name, mimeType: "application/vnd.google-apps.folder", parents: parentId ? [parentId] : undefined }, fields: "id,name,webViewLink" });
  return res.data;
}

async function driveUploadText(name: string, content: string, parentId?: string) {
  const drive = google.drive({ version: "v3", auth: getAuthedClient() });
  const res = await drive.files.create({ requestBody: { name, parents: parentId ? [parentId] : undefined }, media: { mimeType: "text/plain", body: content }, fields: "id,name,webViewLink" });
  return res.data;
}

// ── Gmail ─────────────────────────────────────────────────────────────────────

async function gmailList(query = "", maxResults = 10) {
  const gmail = google.gmail({ version: "v1", auth: getAuthedClient() });
  const res = await gmail.users.messages.list({ userId: "me", q: query, maxResults });
  const messages = res.data.messages ?? [];
  return Promise.all(messages.slice(0, maxResults).map(async (m) => {
    const msg = await gmail.users.messages.get({ userId: "me", id: m.id!, format: "metadata", metadataHeaders: ["Subject", "From", "Date"] });
    const h = msg.data.payload?.headers ?? [];
    return { id: m.id, subject: h.find((x) => x.name === "Subject")?.value ?? "", from: h.find((x) => x.name === "From")?.value ?? "", date: h.find((x) => x.name === "Date")?.value ?? "", snippet: msg.data.snippet ?? "" };
  }));
}

async function gmailRead(messageId: string) {
  const gmail = google.gmail({ version: "v1", auth: getAuthedClient() });
  const msg = await gmail.users.messages.get({ userId: "me", id: messageId, format: "full" });
  const h = msg.data.payload?.headers ?? [];
  const bodyData = msg.data.payload?.parts?.find((p) => p.mimeType === "text/plain")?.body?.data ?? msg.data.payload?.body?.data ?? "";
  return { id: messageId, subject: h.find((x) => x.name === "Subject")?.value ?? "", from: h.find((x) => x.name === "From")?.value ?? "", date: h.find((x) => x.name === "Date")?.value ?? "", body: bodyData ? Buffer.from(bodyData, "base64url").toString("utf-8") : msg.data.snippet ?? "" };
}

async function gmailSend(to: string, subject: string, body: string, htmlBody?: string) {
  const gmail = google.gmail({ version: "v1", auth: getAuthedClient() });
  const profile = await gmail.users.getProfile({ userId: "me" });
  const from = profile.data.emailAddress ?? "me";
  const ct = htmlBody ? "text/html" : "text/plain";
  const raw = Buffer.from(`From: ${from}\r\nTo: ${to}\r\nSubject: ${subject}\r\nContent-Type: ${ct}; charset=utf-8\r\n\r\n${htmlBody ?? body}`).toString("base64url");
  const res = await gmail.users.messages.send({ userId: "me", requestBody: { raw } });
  return { id: res.data.id, threadId: res.data.threadId, to, subject };
}

// ── Calendar ──────────────────────────────────────────────────────────────────

async function calendarListEvents(calendarId = "primary", maxResults = 20, timeMin?: string, timeMax?: string) {
  const cal = google.calendar({ version: "v3", auth: getAuthedClient() });
  const res = await cal.events.list({ calendarId, maxResults, singleEvents: true, orderBy: "startTime", timeMin: timeMin ?? new Date().toISOString(), timeMax: timeMax ?? undefined });
  return res.data.items ?? [];
}

async function calendarListCalendars() {
  const cal = google.calendar({ version: "v3", auth: getAuthedClient() });
  const res = await cal.calendarList.list();
  return res.data.items ?? [];
}

async function calendarCreateEvent(summary: string, start: string, end: string, description?: string, attendees?: string[], calendarId = "primary") {
  const cal = google.calendar({ version: "v3", auth: getAuthedClient() });
  const res = await cal.events.insert({ calendarId, requestBody: { summary, description, start: { dateTime: start, timeZone: "Europe/London" }, end: { dateTime: end, timeZone: "Europe/London" }, attendees: attendees?.map((email) => ({ email })) } });
  return res.data;
}

async function calendarUpdateEvent(eventId: string, updates: Record<string, any>, calendarId = "primary") {
  const cal = google.calendar({ version: "v3", auth: getAuthedClient() });
  const res = await cal.events.patch({ calendarId, eventId, requestBody: updates });
  return res.data;
}

async function calendarDeleteEvent(eventId: string, calendarId = "primary") {
  const cal = google.calendar({ version: "v3", auth: getAuthedClient() });
  await cal.events.delete({ calendarId, eventId });
  return { deleted: true, eventId };
}

// ── Google Docs ───────────────────────────────────────────────────────────────

async function docsCreate(title: string, content?: string) {
  const docs = google.docs({ version: "v1", auth: getAuthedClient() });
  const res = await docs.documents.create({ requestBody: { title } });
  const docId = res.data.documentId!;
  if (content) {
    await docs.documents.batchUpdate({ documentId: docId, requestBody: { requests: [{ insertText: { location: { index: 1 }, text: content } }] } });
  }
  return { id: docId, title, url: `https://docs.google.com/document/d/${docId}/edit` };
}

async function docsRead(documentId: string) {
  const docs = google.docs({ version: "v1", auth: getAuthedClient() });
  const res = await docs.documents.get({ documentId });
  const text = res.data.body?.content?.map((el) => el.paragraph?.elements?.map((e) => e.textRun?.content ?? "").join("") ?? "").join("") ?? "";
  return { id: documentId, title: res.data.title, text };
}

async function docsAppend(documentId: string, text: string) {
  const docs = google.docs({ version: "v1", auth: getAuthedClient() });
  const doc = await docs.documents.get({ documentId });
  const endIndex = doc.data.body?.content?.slice(-1)[0]?.endIndex ?? 1;
  await docs.documents.batchUpdate({ documentId, requestBody: { requests: [{ insertText: { location: { index: endIndex - 1 }, text } }] } });
  return { documentId, appended: true };
}

// ── Google Sheets ─────────────────────────────────────────────────────────────

async function sheetsCreate(title: string) {
  const sheets = google.sheets({ version: "v4", auth: getAuthedClient() });
  const res = await sheets.spreadsheets.create({ requestBody: { properties: { title } } });
  return { id: res.data.spreadsheetId, title, url: res.data.spreadsheetUrl };
}

async function sheetsRead(spreadsheetId: string, range = "Sheet1") {
  const sheets = google.sheets({ version: "v4", auth: getAuthedClient() });
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  return { spreadsheetId, range, values: res.data.values ?? [] };
}

async function sheetsWrite(spreadsheetId: string, range: string, values: any[][]) {
  const sheets = google.sheets({ version: "v4", auth: getAuthedClient() });
  const res = await sheets.spreadsheets.values.update({ spreadsheetId, range, valueInputOption: "USER_ENTERED", requestBody: { values } });
  return { updatedCells: res.data.updatedCells, updatedRange: res.data.updatedRange };
}

async function sheetsAppend(spreadsheetId: string, range: string, values: any[][]) {
  const sheets = google.sheets({ version: "v4", auth: getAuthedClient() });
  const res = await sheets.spreadsheets.values.append({ spreadsheetId, range, valueInputOption: "USER_ENTERED", requestBody: { values } });
  return { updatedCells: res.data.updates?.updatedCells, tableRange: res.data.tableRange };
}

// ── Google Tasks ──────────────────────────────────────────────────────────────

async function tasksListLists() {
  const tasks = google.tasks({ version: "v1", auth: getAuthedClient() });
  const res = await tasks.tasklists.list();
  return res.data.items ?? [];
}

async function tasksList(tasklistId = "@default", showCompleted = false) {
  const tasks = google.tasks({ version: "v1", auth: getAuthedClient() });
  const res = await tasks.tasks.list({ tasklist: tasklistId, showCompleted });
  return res.data.items ?? [];
}

async function tasksCreate(title: string, notes?: string, due?: string, tasklistId = "@default") {
  const tasks = google.tasks({ version: "v1", auth: getAuthedClient() });
  const res = await tasks.tasks.insert({ tasklist: tasklistId, requestBody: { title, notes, due } });
  return res.data;
}

async function tasksComplete(taskId: string, tasklistId = "@default") {
  const tasks = google.tasks({ version: "v1", auth: getAuthedClient() });
  const res = await tasks.tasks.patch({ tasklist: tasklistId, task: taskId, requestBody: { status: "completed" } });
  return res.data;
}

// ── Google Maps ───────────────────────────────────────────────────────────────

const MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY!;
const MAPS_BASE = "https://maps.googleapis.com/maps/api";

async function mapsGeocode(address: string) {
  const url = `${MAPS_BASE}/geocode/json?address=${encodeURIComponent(address)}&key=${MAPS_API_KEY}`;
  const res = await fetch(url);
  const data: any = await res.json();
  if (data.status !== "OK") throw new Error(`Geocode failed: ${data.status} — ${data.error_message ?? ""}`);
  return data.results.map((r: any) => ({
    formatted_address: r.formatted_address,
    lat: r.geometry.location.lat,
    lng: r.geometry.location.lng,
    place_id: r.place_id,
    types: r.types,
  }));
}

async function mapsReverseGeocode(lat: number, lng: number) {
  const url = `${MAPS_BASE}/geocode/json?latlng=${lat},${lng}&key=${MAPS_API_KEY}`;
  const res = await fetch(url);
  const data: any = await res.json();
  if (data.status !== "OK") throw new Error(`Reverse geocode failed: ${data.status}`);
  return data.results[0] ?? null;
}

async function mapsPlacesSearch(query: string, location?: string, radius = 5000) {
  let url = `${MAPS_BASE}/place/textsearch/json?query=${encodeURIComponent(query)}&key=${MAPS_API_KEY}`;
  if (location) url += `&location=${encodeURIComponent(location)}&radius=${radius}`;
  const res = await fetch(url);
  const data: any = await res.json();
  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") throw new Error(`Places search failed: ${data.status}`);
  return (data.results ?? []).slice(0, 10).map((p: any) => ({
    name: p.name,
    address: p.formatted_address,
    rating: p.rating,
    place_id: p.place_id,
    lat: p.geometry?.location?.lat,
    lng: p.geometry?.location?.lng,
    types: p.types?.slice(0, 3),
    open_now: p.opening_hours?.open_now,
  }));
}

async function mapsDirections(origin: string, destination: string, mode: string = "driving") {
  const url = `${MAPS_BASE}/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${mode}&key=${MAPS_API_KEY}`;
  const res = await fetch(url);
  const data: any = await res.json();
  if (data.status !== "OK") throw new Error(`Directions failed: ${data.status}`);
  const route = data.routes[0];
  const leg = route.legs[0];
  return {
    summary: route.summary,
    distance: leg.distance.text,
    duration: leg.duration.text,
    start_address: leg.start_address,
    end_address: leg.end_address,
    steps: leg.steps.map((s: any) => s.html_instructions.replace(/<[^>]+>/g, "")),
  };
}

async function mapsDistanceMatrix(origins: string[], destinations: string[], mode = "driving") {
  const url = `${MAPS_BASE}/distancematrix/json?origins=${encodeURIComponent(origins.join("|"))}&destinations=${encodeURIComponent(destinations.join("|"))}&mode=${mode}&key=${MAPS_API_KEY}`;
  const res = await fetch(url);
  const data: any = await res.json();
  if (data.status !== "OK") throw new Error(`Distance matrix failed: ${data.status}`);
  return {
    origin_addresses: data.origin_addresses,
    destination_addresses: data.destination_addresses,
    rows: data.rows.map((row: any) => row.elements.map((el: any) => ({
      status: el.status,
      distance: el.distance?.text,
      duration: el.duration?.text,
    }))),
  };
}

// ── Google Analytics (GA4) ────────────────────────────────────────────────────

async function analyticsListProperties() {
  const admin = google.analyticsadmin({ version: "v1beta", auth: getAuthedClient() });
  // First get accounts, then list properties per account
  const accountsRes = await admin.accounts.list();
  const accounts = accountsRes.data.accounts ?? [];
  const allProperties: any[] = [];
  for (const account of accounts) {
    const propsRes = await admin.properties.list({ filter: `parent:${account.name}` });
    const props = (propsRes.data.properties ?? []).map((p: any) => ({
      name: p.name,
      displayName: p.displayName,
      account: account.displayName,
      timeZone: p.timeZone,
      currencyCode: p.currencyCode,
      createTime: p.createTime,
    }));
    allProperties.push(...props);
  }
  return allProperties;
}

async function analyticsRunReport(propertyId: string, metrics: string[], dimensions: string[], startDate = "7daysAgo", endDate = "today") {
  const prop = propertyId.startsWith("properties/") ? propertyId : `properties/${propertyId}`;
  const analyticsData = google.analyticsdata({ version: "v1beta", auth: getAuthedClient() });
  const res = await (analyticsData.properties as any).runReport({
    property: prop,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      metrics: metrics.map((m) => ({ name: m })),
      dimensions: dimensions.map((d) => ({ name: d })),
      limit: "20",
    },
  }) as any;
  const rows = res.data.rows ?? [];
  return {
    rowCount: res.data.rowCount,
    headers: {
      dimensions: res.data.dimensionHeaders?.map((h: any) => h.name),
      metrics: res.data.metricHeaders?.map((h: any) => h.name),
    },
    rows: rows.map((r: any) => ({
      dimensions: r.dimensionValues?.map((v: any) => v.value),
      metrics: r.metricValues?.map((v: any) => v.value),
    })),
  };
}

async function analyticsRealtimeReport(propertyId: string, metrics: string[], dimensions: string[]) {
  const prop = propertyId.startsWith("properties/") ? propertyId : `properties/${propertyId}`;
  const analyticsData = google.analyticsdata({ version: "v1beta", auth: getAuthedClient() });
  const res = await (analyticsData.properties as any).runRealtimeReport({
    property: prop,
    requestBody: {
      metrics: metrics.map((m) => ({ name: m })),
      dimensions: dimensions.map((d) => ({ name: d })),
    },
  }) as any;
  return {
    rowCount: res.data.rowCount,
    headers: {
      dimensions: res.data.dimensionHeaders?.map((h: any) => h.name),
      metrics: res.data.metricHeaders?.map((h: any) => h.name),
    },
    rows: (res.data.rows ?? []).map((r: any) => ({
      dimensions: r.dimensionValues?.map((v: any) => v.value),
      metrics: r.metricValues?.map((v: any) => v.value),
    })),
  };
}

// ── Contacts ──────────────────────────────────────────────────────────────────

async function contactsList(maxResults = 20) {
  const people = google.people({ version: "v1", auth: getAuthedClient() });
  const res = await people.people.connections.list({ resourceName: "people/me", pageSize: maxResults, personFields: "names,emailAddresses,phoneNumbers,organizations" });
  return (res.data.connections ?? []).map((c) => ({ name: c.names?.[0]?.displayName, email: c.emailAddresses?.[0]?.value, phone: c.phoneNumbers?.[0]?.value, org: c.organizations?.[0]?.name }));
}

async function contactsSearch(query: string) {
  const people = google.people({ version: "v1", auth: getAuthedClient() });
  const res = await people.people.searchContacts({ query, readMask: "names,emailAddresses,phoneNumbers,organizations" });
  return (res.data.results ?? []).map((r) => ({ name: r.person?.names?.[0]?.displayName, email: r.person?.emailAddresses?.[0]?.value, phone: r.person?.phoneNumbers?.[0]?.value, org: r.person?.organizations?.[0]?.name }));
}

// ── MCP Server ────────────────────────────────────────────────────────────────

const server = new Server({ name: "mcp-google", version: "2.0.0" }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    // Auth
    { name: "google_auth_status", description: "Check if Google OAuth tokens are saved and valid.", inputSchema: { type: "object", properties: {} } },
    { name: "google_auth_url", description: "Generate Google OAuth2 authorization URL. Open in browser to authorize all Google services.", inputSchema: { type: "object", properties: {} } },
    { name: "google_auth_exchange", description: "Exchange OAuth2 code (from redirect URL after browser auth) for tokens.", inputSchema: { type: "object", properties: { code: { type: "string" } }, required: ["code"] } },
    // Gemini
    { name: "gemini_generate", description: "Generate text with Gemini AI (gemini-2.0-flash by default).", inputSchema: { type: "object", properties: { prompt: { type: "string" }, model: { type: "string", default: "gemini-2.0-flash" } }, required: ["prompt"] } },
    { name: "gemini_chat", description: "Multi-turn chat with Gemini AI.", inputSchema: { type: "object", properties: { message: { type: "string" }, history: { type: "array", items: { type: "object", properties: { role: { type: "string" }, parts: { type: "string" } } } }, model: { type: "string" } }, required: ["message"] } },
    // Drive
    { name: "drive_list_files", description: "List files in Google Drive.", inputSchema: { type: "object", properties: { query: { type: "string" }, maxResults: { type: "number" } } } },
    { name: "drive_search", description: "Search Google Drive files by name.", inputSchema: { type: "object", properties: { query: { type: "string" }, maxResults: { type: "number" } }, required: ["query"] } },
    { name: "drive_read_file", description: "Read a Google Drive file by ID (supports Docs, Sheets, plain text).", inputSchema: { type: "object", properties: { fileId: { type: "string" } }, required: ["fileId"] } },
    { name: "drive_upload_text", description: "Upload a text file to Google Drive.", inputSchema: { type: "object", properties: { name: { type: "string" }, content: { type: "string" }, parentId: { type: "string" } }, required: ["name", "content"] } },
    { name: "drive_create_folder", description: "Create a new folder in Google Drive.", inputSchema: { type: "object", properties: { name: { type: "string" }, parentId: { type: "string" } }, required: ["name"] } },
    // Gmail
    { name: "gmail_list", description: "List Gmail messages with optional search query.", inputSchema: { type: "object", properties: { query: { type: "string", description: "Gmail search (e.g. 'is:unread', 'from:boss@co.uk')" }, maxResults: { type: "number" } } } },
    { name: "gmail_read", description: "Read a Gmail message by ID.", inputSchema: { type: "object", properties: { messageId: { type: "string" } }, required: ["messageId"] } },
    { name: "gmail_send", description: "Send an email via Gmail.", inputSchema: { type: "object", properties: { to: { type: "string" }, subject: { type: "string" }, body: { type: "string" }, htmlBody: { type: "string" } }, required: ["to", "subject", "body"] } },
    // Calendar
    { name: "calendar_list_events", description: "List upcoming Google Calendar events.", inputSchema: { type: "object", properties: { calendarId: { type: "string" }, maxResults: { type: "number" }, timeMin: { type: "string" }, timeMax: { type: "string" } } } },
    { name: "calendar_list_calendars", description: "List all accessible Google Calendars.", inputSchema: { type: "object", properties: {} } },
    { name: "calendar_create_event", description: "Create a new calendar event.", inputSchema: { type: "object", properties: { summary: { type: "string" }, start: { type: "string", description: "ISO datetime e.g. 2026-02-24T10:00:00" }, end: { type: "string" }, description: { type: "string" }, attendees: { type: "array", items: { type: "string" } }, calendarId: { type: "string" } }, required: ["summary", "start", "end"] } },
    { name: "calendar_update_event", description: "Update an existing calendar event.", inputSchema: { type: "object", properties: { eventId: { type: "string" }, updates: { type: "object" }, calendarId: { type: "string" } }, required: ["eventId", "updates"] } },
    { name: "calendar_delete_event", description: "Delete a calendar event.", inputSchema: { type: "object", properties: { eventId: { type: "string" }, calendarId: { type: "string" } }, required: ["eventId"] } },
    // Docs
    { name: "docs_create", description: "Create a new Google Doc.", inputSchema: { type: "object", properties: { title: { type: "string" }, content: { type: "string" } }, required: ["title"] } },
    { name: "docs_read", description: "Read a Google Doc by ID.", inputSchema: { type: "object", properties: { documentId: { type: "string" } }, required: ["documentId"] } },
    { name: "docs_append", description: "Append text to an existing Google Doc.", inputSchema: { type: "object", properties: { documentId: { type: "string" }, text: { type: "string" } }, required: ["documentId", "text"] } },
    // Sheets
    { name: "sheets_create", description: "Create a new Google Spreadsheet.", inputSchema: { type: "object", properties: { title: { type: "string" } }, required: ["title"] } },
    { name: "sheets_read", description: "Read values from a Google Spreadsheet.", inputSchema: { type: "object", properties: { spreadsheetId: { type: "string" }, range: { type: "string", description: "e.g. 'Sheet1' or 'Sheet1!A1:D10'" } }, required: ["spreadsheetId"] } },
    { name: "sheets_write", description: "Write values to a Google Spreadsheet range.", inputSchema: { type: "object", properties: { spreadsheetId: { type: "string" }, range: { type: "string" }, values: { type: "array", items: { type: "array" } } }, required: ["spreadsheetId", "range", "values"] } },
    { name: "sheets_append", description: "Append rows to a Google Spreadsheet.", inputSchema: { type: "object", properties: { spreadsheetId: { type: "string" }, range: { type: "string" }, values: { type: "array", items: { type: "array" } } }, required: ["spreadsheetId", "range", "values"] } },
    // Tasks
    { name: "tasks_list_lists", description: "List all Google Task lists.", inputSchema: { type: "object", properties: {} } },
    { name: "tasks_list", description: "List tasks in a task list.", inputSchema: { type: "object", properties: { tasklistId: { type: "string", default: "@default" }, showCompleted: { type: "boolean" } } } },
    { name: "tasks_create", description: "Create a new task.", inputSchema: { type: "object", properties: { title: { type: "string" }, notes: { type: "string" }, due: { type: "string", description: "Due date ISO string" }, tasklistId: { type: "string" } }, required: ["title"] } },
    { name: "tasks_complete", description: "Mark a task as completed.", inputSchema: { type: "object", properties: { taskId: { type: "string" }, tasklistId: { type: "string" } }, required: ["taskId"] } },
    // Contacts
    { name: "contacts_list", description: "List Google Contacts.", inputSchema: { type: "object", properties: { maxResults: { type: "number" } } } },
    { name: "contacts_search", description: "Search Google Contacts by name or email.", inputSchema: { type: "object", properties: { query: { type: "string" } }, required: ["query"] } },
    // Maps
    { name: "maps_geocode", description: "Convert an address to coordinates (lat/lng) using Google Maps.", inputSchema: { type: "object", properties: { address: { type: "string", description: "Address to geocode" } }, required: ["address"] } },
    { name: "maps_reverse_geocode", description: "Convert lat/lng coordinates to a human-readable address.", inputSchema: { type: "object", properties: { lat: { type: "number" }, lng: { type: "number" } }, required: ["lat", "lng"] } },
    { name: "maps_places_search", description: "Search for places using Google Maps Places API.", inputSchema: { type: "object", properties: { query: { type: "string", description: "Search query e.g. 'coffee shops near me'" }, location: { type: "string", description: "Centre point e.g. '51.5074,-0.1278'" }, radius: { type: "number", description: "Search radius in metres (default 5000)" } }, required: ["query"] } },
    { name: "maps_directions", description: "Get directions between two locations.", inputSchema: { type: "object", properties: { origin: { type: "string" }, destination: { type: "string" }, mode: { type: "string", description: "Travel mode: driving, walking, bicycling, transit (default: driving)" } }, required: ["origin", "destination"] } },
    { name: "maps_distance_matrix", description: "Get distances and travel times between multiple origins and destinations.", inputSchema: { type: "object", properties: { origins: { type: "array", items: { type: "string" } }, destinations: { type: "array", items: { type: "string" } }, mode: { type: "string", description: "Travel mode (default: driving)" } }, required: ["origins", "destinations"] } },
    // Analytics
    { name: "analytics_list_properties", description: "List all Google Analytics 4 properties in the account.", inputSchema: { type: "object", properties: {} } },
    { name: "analytics_run_report", description: "Run a GA4 analytics report for a property.", inputSchema: { type: "object", properties: { propertyId: { type: "string", description: "GA4 property ID (e.g. '123456789' or 'properties/123456789')" }, metrics: { type: "array", items: { type: "string" }, description: "Metrics e.g. ['sessions', 'activeUsers', 'screenPageViews']" }, dimensions: { type: "array", items: { type: "string" }, description: "Dimensions e.g. ['date', 'country', 'pagePath']" }, startDate: { type: "string", description: "Start date e.g. '7daysAgo', '30daysAgo', '2026-01-01' (default: 7daysAgo)" }, endDate: { type: "string", description: "End date e.g. 'today', '2026-01-31' (default: today)" } }, required: ["propertyId", "metrics", "dimensions"] } },
    { name: "analytics_realtime", description: "Get real-time active users and events from GA4.", inputSchema: { type: "object", properties: { propertyId: { type: "string" }, metrics: { type: "array", items: { type: "string" }, description: "e.g. ['activeUsers']" }, dimensions: { type: "array", items: { type: "string" }, description: "e.g. ['country', 'pagePath']" } }, required: ["propertyId", "metrics", "dimensions"] } },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;
  const a = (args ?? {}) as Record<string, any>;
  try {
    let result: any;
    switch (name) {
      // Auth
      case "google_auth_status": {
        const t = loadTokens();
        result = t ? { authenticated: true, hasRefreshToken: !!t.refresh_token, tokenPath: TOKEN_PATH, scopes: SCOPES } : { authenticated: false, message: "Run google_auth_url to start OAuth flow." };
        break;
      }
      case "google_auth_url": {
        const client = getOAuthClient();
        const url = client.generateAuthUrl({ access_type: "offline", scope: SCOPES, prompt: "consent" });
        result = { authUrl: url, instructions: "1. Open this URL in your browser. 2. Sign in and authorize. 3. Copy the 'code' parameter from the redirect URL. 4. Call google_auth_exchange with that code." };
        break;
      }
      case "google_auth_exchange": {
        const client = getOAuthClient();
        const { tokens } = await client.getToken(a.code);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
        result = { success: true, message: "Tokens saved. All Google services are now authorized.", tokenPath: TOKEN_PATH };
        break;
      }
      // Gemini
      case "gemini_generate": result = { text: await geminiGenerate(a.prompt, a.model) }; break;
      case "gemini_chat": result = { text: await geminiChat(a.history ?? [], a.message, a.model) }; break;
      // Drive
      case "drive_list_files": result = await driveListFiles(a.query, a.maxResults); break;
      case "drive_search": result = await driveSearch(a.query, a.maxResults); break;
      case "drive_read_file": result = await driveReadFile(a.fileId); break;
      case "drive_upload_text": result = await driveUploadText(a.name, a.content, a.parentId); break;
      case "drive_create_folder": result = await driveCreateFolder(a.name, a.parentId); break;
      // Gmail
      case "gmail_list": result = await gmailList(a.query, a.maxResults); break;
      case "gmail_read": result = await gmailRead(a.messageId); break;
      case "gmail_send": result = await gmailSend(a.to, a.subject, a.body, a.htmlBody); break;
      // Calendar
      case "calendar_list_events": result = await calendarListEvents(a.calendarId, a.maxResults, a.timeMin, a.timeMax); break;
      case "calendar_list_calendars": result = await calendarListCalendars(); break;
      case "calendar_create_event": result = await calendarCreateEvent(a.summary, a.start, a.end, a.description, a.attendees, a.calendarId); break;
      case "calendar_update_event": result = await calendarUpdateEvent(a.eventId, a.updates, a.calendarId); break;
      case "calendar_delete_event": result = await calendarDeleteEvent(a.eventId, a.calendarId); break;
      // Docs
      case "docs_create": result = await docsCreate(a.title, a.content); break;
      case "docs_read": result = await docsRead(a.documentId); break;
      case "docs_append": result = await docsAppend(a.documentId, a.text); break;
      // Sheets
      case "sheets_create": result = await sheetsCreate(a.title); break;
      case "sheets_read": result = await sheetsRead(a.spreadsheetId, a.range); break;
      case "sheets_write": result = await sheetsWrite(a.spreadsheetId, a.range, a.values); break;
      case "sheets_append": result = await sheetsAppend(a.spreadsheetId, a.range, a.values); break;
      // Tasks
      case "tasks_list_lists": result = await tasksListLists(); break;
      case "tasks_list": result = await tasksList(a.tasklistId, a.showCompleted); break;
      case "tasks_create": result = await tasksCreate(a.title, a.notes, a.due, a.tasklistId); break;
      case "tasks_complete": result = await tasksComplete(a.taskId, a.tasklistId); break;
      // Contacts
      case "contacts_list": result = await contactsList(a.maxResults); break;
      case "contacts_search": result = await contactsSearch(a.query); break;
      // Maps
      case "maps_geocode": result = await mapsGeocode(a.address); break;
      case "maps_reverse_geocode": result = await mapsReverseGeocode(a.lat, a.lng); break;
      case "maps_places_search": result = await mapsPlacesSearch(a.query, a.location, a.radius); break;
      case "maps_directions": result = await mapsDirections(a.origin, a.destination, a.mode); break;
      case "maps_distance_matrix": result = await mapsDistanceMatrix(a.origins, a.destinations, a.mode); break;
      // Analytics
      case "analytics_list_properties": result = await analyticsListProperties(); break;
      case "analytics_run_report": result = await analyticsRunReport(a.propertyId, a.metrics, a.dimensions, a.startDate, a.endDate); break;
      case "analytics_realtime": result = await analyticsRealtimeReport(a.propertyId, a.metrics, a.dimensions); break;
      default: throw new Error(`Unknown tool: ${name}`);
    }
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  } catch (err: any) {
    return { content: [{ type: "text", text: `Error: ${err.message}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("[mcp-google] v2.1 — Gemini ✓ Drive ✓ Gmail ✓ Calendar ✓ Docs ✓ Sheets ✓ Tasks ✓ Contacts ✓ Maps ✓ Analytics ✓");
