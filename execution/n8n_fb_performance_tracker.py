"""
n8n_fb_performance_tracker.py — Weekly Post Performance Report
===============================================================
Called by n8n cron (Monday 09:00 UK) to generate engagement analytics.

Flow:
  1. Pull last 7 days of post IDs from Supabase social_posts
  2. Fetch engagement metrics from Facebook Graph API
  3. Track all engagers (likers/commenters) for retargeting
  4. AI-analyse patterns and generate "What Worked" recommendations
  5. Email report to Jonny + store in Supabase

Usage:
  python execution/n8n_fb_performance_tracker.py           # Full report
  python execution/n8n_fb_performance_tracker.py --dry-run  # Preview only
"""

import os
import sys
import json
import requests
import re
from datetime import datetime, timezone, timedelta
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

try:
    from dotenv import load_dotenv
    load_dotenv()
except: pass

BRAIN_URL = os.getenv("ANTIGRAVITY_BRAIN_URL", "")
BRAIN_KEY = os.getenv("ANTIGRAVITY_BRAIN_SERVICE_ROLE_KEY", "")
RESEND_KEY = os.getenv("RESEND_API_KEY", "")
FB_PAGE_TOKEN = os.getenv("FACEBOOK_PAGE_ACCESS_TOKEN", "")
FB_PAGE_ID = os.getenv("FACEBOOK_PAGE_ID", "")
ANTHROPIC_KEY = os.getenv("ANTHROPIC_API_KEY", "")


def get_recent_posts(days=7):
    """Pull posts from Supabase social_posts table."""
    if not BRAIN_URL: return []
    since = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat()
    try:
        resp = requests.get(
            f"{BRAIN_URL}/rest/v1/social_posts",
            headers={"apikey": BRAIN_KEY, "Authorization": f"Bearer {BRAIN_KEY}"},
            params={
                "created_at": f"gte.{since}",
                "select": "id,pillar,facebook_copy,instagram_copy,image_url,source_agent,created_at,status",
                "order": "created_at.desc",
                "limit": "50"
            },
            timeout=8
        )
        return resp.json() if resp.status_code == 200 else []
    except: return []


def get_page_posts_metrics(days=7):
    """Fetch recent posts and their engagement from Facebook Graph API."""
    if not FB_PAGE_TOKEN or not FB_PAGE_ID:
        print("  ⚠️ Facebook credentials missing")
        return []

    since_ts = int((datetime.now(timezone.utc) - timedelta(days=days)).timestamp())
    
    try:
        resp = requests.get(
            f"https://graph.facebook.com/v19.0/{FB_PAGE_ID}/posts",
            params={
                "access_token": FB_PAGE_TOKEN,
                "fields": "id,message,created_time,shares,likes.summary(true),comments.summary(true),insights.metric(post_impressions,post_engaged_users,post_clicks)",
                "since": since_ts,
                "limit": 25
            },
            timeout=15
        )
        if resp.status_code == 200:
            return resp.json().get("data", [])
        else:
            print(f"  ❌ FB API error: {resp.status_code} - {resp.text[:200]}")
            return []
    except Exception as e:
        print(f"  ❌ FB API connection error: {e}")
        return []


def track_all_engagers(posts):
    """Track likers and commenters from all posts for retargeting."""
    sys.path.insert(0, str(Path(__file__).parent))
    from n8n_fb_lead_pipeline import track_post_engagers
    
    total = 0
    for post in posts:
        post_id = post.get("id", "")
        if post_id:
            engagers = track_post_engagers(post_id)
            total += len(engagers)
    return total


def analyse_with_ai(metrics_summary: str) -> str:
    """Use Claude to analyse post performance and recommend next actions."""
    if not ANTHROPIC_KEY:
        return "AI analysis unavailable (no ANTHROPIC_API_KEY)"
    
    try:
        import anthropic
        client = anthropic.Anthropic(api_key=ANTHROPIC_KEY)
        resp = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=800,
            system="""You are a social media strategist for Antigravity, a UK-based digital agency.
Analyse the following weekly Facebook performance data and provide:
1. Top 3 performing posts (by engagement) and WHY they worked
2. Bottom 3 posts and what went wrong
3. 3 specific recommendations for next week's content
4. Best posting time based on the data

Use UK English. Be direct and actionable. No fluff.""",
            messages=[{"role": "user", "content": metrics_summary}]
        )
        return resp.content[0].text
    except Exception as e:
        return f"AI analysis error: {e}"


def generate_report(dry_run=False):
    """Full weekly performance report."""
    now = datetime.now(timezone.utc)
    
    print(f"\n{'='*60}")
    print(f"📊 WEEKLY PERFORMANCE TRACKER | {now.strftime('%d/%m/%Y')}")
    print(f"{'='*60}")

    # 1. Get Supabase posts (our record)
    db_posts = get_recent_posts(7)
    print(f"  📋 Posts in Supabase (last 7 days): {len(db_posts)}")

    # 2. Get Facebook metrics
    fb_posts = get_page_posts_metrics(7)
    print(f"  📈 Posts fetched from Facebook: {len(fb_posts)}")

    # 3. Track engagers for retargeting
    total_engagers = track_all_engagers(fb_posts)
    print(f"  👥 Total engagers tracked: {total_engagers}")

    # 4. Build metrics summary
    post_summaries = []
    total_likes = 0
    total_comments = 0
    total_shares = 0

    for post in fb_posts:
        msg = (post.get("message") or "")[:100]
        likes = post.get("likes", {}).get("summary", {}).get("total_count", 0)
        comments = post.get("comments", {}).get("summary", {}).get("total_count", 0)
        shares = post.get("shares", {}).get("count", 0)
        created = post.get("created_time", "")
        
        total_likes += likes
        total_comments += comments
        total_shares += shares

        post_summaries.append({
            "message": msg,
            "likes": likes,
            "comments": comments,
            "shares": shares,
            "engagement": likes + comments + shares,
            "created": created
        })

    # Sort by engagement
    post_summaries.sort(key=lambda x: x["engagement"], reverse=True)

    metrics_text = f"""
WEEKLY FACEBOOK PERFORMANCE — {now.strftime('%d/%m/%Y')}
Period: Last 7 days
Total Posts: {len(fb_posts)}
Total Likes: {total_likes}
Total Comments: {total_comments}
Total Shares: {total_shares}
Total Engagers Tracked: {total_engagers}

POST BREAKDOWN (ranked by engagement):
"""
    for i, p in enumerate(post_summaries, 1):
        metrics_text += f"\n{i}. [{p['created'][:10]}] {p['message']}...\n   Likes: {p['likes']} | Comments: {p['comments']} | Shares: {p['shares']} | Score: {p['engagement']}\n"

    print(f"\n{metrics_text}")

    # 5. AI Analysis
    print(f"  🤖 Running AI analysis...")
    ai_analysis = analyse_with_ai(metrics_text)
    print(f"\n{ai_analysis}")

    # 6. Build email report
    report = {
        "period": f"Week ending {now.strftime('%d/%m/%Y')}",
        "total_posts": len(fb_posts),
        "total_likes": total_likes,
        "total_comments": total_comments,
        "total_shares": total_shares,
        "total_engagers_tracked": total_engagers,
        "top_posts": post_summaries[:3],
        "bottom_posts": post_summaries[-3:] if len(post_summaries) >= 3 else [],
        "ai_analysis": ai_analysis,
        "generated_at": now.isoformat()
    }

    if dry_run:
        print(f"\n  [DRY RUN] Would email report + store in Supabase")
        return report

    # 7. Store report in Supabase
    if BRAIN_URL and BRAIN_KEY:
        try:
            requests.post(
                f"{BRAIN_URL}/rest/v1/performance_reports",
                headers={
                    "apikey": BRAIN_KEY,
                    "Authorization": f"Bearer {BRAIN_KEY}",
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal"
                },
                json={
                    "report_type": "weekly_social",
                    "platform": "facebook",
                    "data": json.dumps(report),
                    "ai_summary": ai_analysis,
                    "period_start": (now - timedelta(days=7)).isoformat(),
                    "period_end": now.isoformat()
                },
                timeout=8
            )
            print(f"  💾 Report stored in Supabase")
        except Exception as e:
            print(f"  ⚠️ Supabase store error: {e}")

    # 8. Email report to Jonny
    if RESEND_KEY:
        try:
            # Build clean HTML for email
            top_posts_html = ""
            for i, p in enumerate(post_summaries[:5], 1):
                bar_width = min(100, (p['engagement'] / max(1, post_summaries[0]['engagement'])) * 100)
                top_posts_html += f"""
                <tr>
                    <td style="padding: 8px; color: #e0e0e0;">{i}.</td>
                    <td style="padding: 8px; color: #b0b0b0;">{p['message'][:60]}...</td>
                    <td style="padding: 8px; color: #6c63ff; text-align: center;">{p['likes']}</td>
                    <td style="padding: 8px; color: #6c63ff; text-align: center;">{p['comments']}</td>
                    <td style="padding: 8px; color: #6c63ff; text-align: center;">{p['shares']}</td>
                </tr>
                """

            email_html = f"""
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 40px; background: #0a0a0a; color: #e0e0e0; border-radius: 12px;">
                <h1 style="color: #ffffff; font-size: 22px;">📊 Weekly Social Performance</h1>
                <p style="color: #888;">Week ending {now.strftime('%d/%m/%Y')}</p>
                
                <div style="display: flex; gap: 16px; margin: 24px 0;">
                    <div style="flex:1; background:#1a1a2e; padding:20px; border-radius:8px; text-align:center;">
                        <div style="font-size:28px; color:#6c63ff; font-weight:bold;">{len(fb_posts)}</div>
                        <div style="color:#888; font-size:12px;">Posts</div>
                    </div>
                    <div style="flex:1; background:#1a1a2e; padding:20px; border-radius:8px; text-align:center;">
                        <div style="font-size:28px; color:#6c63ff; font-weight:bold;">{total_likes}</div>
                        <div style="color:#888; font-size:12px;">Likes</div>
                    </div>
                    <div style="flex:1; background:#1a1a2e; padding:20px; border-radius:8px; text-align:center;">
                        <div style="font-size:28px; color:#6c63ff; font-weight:bold;">{total_comments}</div>
                        <div style="color:#888; font-size:12px;">Comments</div>
                    </div>
                    <div style="flex:1; background:#1a1a2e; padding:20px; border-radius:8px; text-align:center;">
                        <div style="font-size:28px; color:#6c63ff; font-weight:bold;">{total_shares}</div>
                        <div style="color:#888; font-size:12px;">Shares</div>
                    </div>
                </div>

                <h2 style="color:#fff; font-size:16px; margin-top:32px;">Top Posts This Week</h2>
                <table style="width:100%; border-collapse:collapse;">
                    <tr style="border-bottom:1px solid #333;">
                        <th style="padding:8px; color:#888; text-align:left;">#</th>
                        <th style="padding:8px; color:#888; text-align:left;">Post</th>
                        <th style="padding:8px; color:#888; text-align:center;">👍</th>
                        <th style="padding:8px; color:#888; text-align:center;">💬</th>
                        <th style="padding:8px; color:#888; text-align:center;">🔄</th>
                    </tr>
                    {top_posts_html}
                </table>

                <h2 style="color:#fff; font-size:16px; margin-top:32px;">AI Analysis</h2>
                <div style="background:#1a1a2e; padding:20px; border-radius:8px; border-left:4px solid #6c63ff;">
                    <p style="color:#b0b0b0; white-space:pre-wrap; line-height:1.6;">{ai_analysis}</p>
                </div>

                <hr style="border:1px solid #222; margin:32px 0;" />
                <p style="font-size:11px; color:#555;">Generated by Antigravity Social Intelligence | {now.strftime('%d/%m/%Y %H:%M')} UTC</p>
            </div>
            """

            requests.post(
                "https://api.resend.com/emails",
                headers={"Authorization": f"Bearer {RESEND_KEY}", "Content-Type": "application/json"},
                json={
                    "from": "Antigravity Intel <reports@jonnyai.co.uk>",
                    "to": ["jonny@jonnyai.co.uk"],
                    "subject": f"📊 Weekly Social Report — {now.strftime('%d/%m/%Y')}",
                    "html": email_html
                },
                timeout=10
            )
            print(f"  📧 Report emailed to jonny@jonnyai.co.uk")
        except Exception as e:
            print(f"  ⚠️ Email error: {e}")

    print(f"\n✅ Performance report complete.")
    return report


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    
    report = generate_report(dry_run=args.dry_run)
    print(json.dumps({"posts": report.get("total_posts", 0), "engagement": report.get("total_likes", 0) + report.get("total_comments", 0)}, indent=2))
