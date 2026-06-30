# Backup and Restore

## Export from Dashboard

Open the Backup tab and click:

```text
Export Backup
```

This downloads a JSON backup.

## Export from PowerShell

Start backend, then run:

```powershell
.\scripts\export-backup.ps1
```

Backups are saved to:

```text
backups/
```

## Import

Open the Backup tab, paste backup JSON, and click:

```text
Import from Text
```

## Notes

This is an MVP backup system for local JSON persistence. PostgreSQL backup/restore will be handled separately in a later release.
