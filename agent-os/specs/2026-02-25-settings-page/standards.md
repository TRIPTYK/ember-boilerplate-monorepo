# Standards Applied

## GTS strict mode
All components use Glimmer strict mode (.gts extension, no implicit globals).

## Ember service injection
`@service declare xxx: XxxService` pattern.

## WarpDrive
Settings loaded via `SettingService.loadAll()` and mutated via `SettingService.save()`.
