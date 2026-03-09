# Android Build Runbook (Windows)

**Author**: Deploy Agent (Owen Stinger) + Sentinel Agent (Sam Blackwood)  
**Training Day**: 2026-02-01  
**Status**: Active Protocol

---

## Overview

Building React Native / Expo apps on Windows requires specific configuration to avoid common pitfalls. This runbook documents the proven protocols.

---

## The Three Killers

### 1. Silent Gradle Failures

**Problem**: `run_command` executes Gradle, but output is swallowed. Build fails with no visible error.

**Solution**: Always redirect stdout AND stderr to a log file:
```powershell
cmd /c "cd android && gradlew.bat assembleRelease > build.log 2>&1"
```

Then monitor:
```powershell
Get-Content "android\build.log" -Tail 20
```

---

### 2. Windows MAX_PATH (260 Character Limit)

**Problem**: React Native native modules (especially `react-native-skia`, `react-native-reanimated`, `react-native-safe-area-context`) generate deeply nested build artifacts that exceed Windows' 260-character path limit.

**Symptoms**:
- `Filename longer than 260 characters`
- Build fails during CMake compilation

**Failed Solutions**:
- `allprojects { buildDir = "C:/short/path" }` - Breaks Expo Autolinking
- `subst X:` - Gradle resolves canonical paths, bypasses the mapping

**Working Solution**: **Move project to short path**
```powershell
# Create short work directory
mkdir C:\Users\jonny\W

# Copy source (exclude heavy folders)
robocopy "Long\Path\To\Project" "C:\Users\jonny\W\P" /MIR /XD node_modules android .git .expo .tmp

# Fresh install in new location
cd C:\Users\jonny\W\P
npm install
npx expo prebuild --platform android --clean

# Configure SDK
echo "sdk.dir=C\:\\Users\\jonny\\AppData\\Local\\Android\\Sdk" > android\local.properties

# Build
cmd /c "cd android && gradlew.bat assembleRelease > build.log 2>&1"
```

**Path Budget**: Keep total project path under 30 characters. e.g., `C:\Users\jonny\W\P` = 21 chars.

---

### 3. SDK Configuration

**Problem**: `$env:ANDROID_HOME` is unreliable in sub-shells and `cmd /c` contexts.

**Solution**: Always create `android/local.properties`:
```properties
sdk.dir=C\:\\Users\\jonny\\AppData\\Local\\Android\\Sdk
```

Note the escaped colons and backslashes.

---

## Pre-Build Checklist

1. [ ] Project path is under 30 characters
2. [ ] `android/local.properties` has `sdk.dir`
3. [ ] `npm install` completed successfully
4. [ ] `npx expo prebuild --platform android --clean` ran
5. [ ] Build command uses `> build.log 2>&1` for logging

---

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `Filename longer than 260 characters` | Path too deep | Move project to `C:\Users\jonny\W\X` |
| `autolinking.json not found` | Changed `buildDir` in gradle | Revert buildDir, use path migration instead |
| `Cannot find module 'X/plugin'` | Missing Babel plugin or package | Check `babel.config.js`, run `npm install` |
| `sdk.dir not set` | Missing properties file | Create `android/local.properties` |
| Build passes but no output | Swallowed streams | Use `cmd /c "... > log 2>&1"` pattern |

---

## APK Location

After successful build:
```
android/app/build/outputs/apk/release/app-release.apk
```

---

*This runbook is maintained by the Antigravity Agent Orchestra.*


## SDK Version Conflicts
If you see equires libraries ... to compile against version 36 or later:
1. Open ndroid/build.gradle.
2. Update compileSdkVersion and 	argetSdkVersion to the requested version (e.g., 36).
3. Ensure you have the Android Platform SDK installed via Android Studio or sdkmanager.
