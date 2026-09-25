; Thinksoft Windows installer.
;
; electron-builder's NSIS target cannot be compiled on this machine: makensis is a
; 32-bit binary and fails with "Internal compiler error #12345: error creating mmap"
; on the 241 MB payload that contains the bundled CLI. Inno Setup streams the same
; payload with LZMA instead, so the installer builds locally and produces the same
; per-user install electron-builder's oneClick target does.
;
; Branded values here must stay in step with packages/desktop/electron-builder.config.ts:
;   productName  Thinksoft          -> AppName, shortcuts, setup title
;   appId        ai.opencode.desktop -> DefaultDirName
;   APP_GUID     d074f30d-...        -> AppId, matched without braces to the old key
;   author       Thinksoft          -> AppPublisher

#define AppName "Thinksoft"
#define AppVersion "2.0.16"
#define AppExeName "Thinksoft.exe"
#define AppDirName "thinksoft-desktop"
; electron-builder writes this uninstall key without braces, so the id must match it
; exactly for Inno to treat the old build as a previous version of this app.
#define AppId "d074f30d-5f88-5885-b075-be1348cc7676"
#define SourceDir "dist\win-unpacked"
#define OutputDir "dist"

[Setup]
AppId={#AppId}
AppName={#AppName}
AppVersion={#AppVersion}
AppVerName={#AppName} {#AppVersion}
AppPublisher={#AppName}
AppPublisherURL=https://thinksoft.dev
AppSupportURL=https://thinksoft.dev
AppUpdatesURL=https://thinksoft.dev
VersionInfoVersion={#AppVersion}
DefaultDirName={autopf}\{#AppDirName}
DefaultGroupName={#AppName}
DisableProgramGroupPage=yes
OutputDir={#OutputDir}
OutputBaseFilename={#AppName}-Setup-x64
SetupIconFile=resources\icons\icon.ico
UninstallDisplayIcon={app}\{#AppExeName}
UninstallDisplayName={#AppName} {#AppVersion}
Compression=lzma2/max
SolidCompression=yes
WizardStyle=modern
; electron-builder's oneClick per-user install needs no elevation, and matching that
; keeps the install at the same path the previous build used.
PrivilegesRequired=lowest
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
MinVersion=10.0

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "Create a desktop shortcut"; GroupDescription: "Shortcuts:"
Name: "autostart"; Description: "Start {#AppName} when I sign in to Windows"; GroupDescription: "Startup:"

[Files]
Source: "{#SourceDir}\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\{#AppName}"; Filename: "{app}\{#AppExeName}"
Name: "{group}\Uninstall {#AppName}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\{#AppName}"; Filename: "{app}\{#AppExeName}"; Tasks: desktopicon
Name: "{userstartup}\{#AppName}"; Filename: "{app}\{#AppExeName}"; Tasks: autostart

[Run]
Filename: "{app}\{#AppExeName}"; Description: "Launch {#AppName}"; Flags: nowait postinstall skipifsilent

[UninstallDelete]
; The updater stages its installer under the app id directory.
Type: filesandordirs; Name: "{localappdata}\{#AppDirName}-updater"
