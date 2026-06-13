# API Draft

This is a future API draft. It is not implemented in v0.1.

## Endpoints

### `POST /services`

Create a creator service.

### `POST /intake`

Submit fan intake for a service.

### `GET /cases`

List cases for a creator workspace.

### `POST /cases/:id/tags`

Save creator-reviewed style tags for a case.

### `POST /cases/:id/rules/match`

Run or save rule matches for a case.

### `POST /cases/:id/report`

Create or update a lite report draft.

### `POST /reports/:id/feedback`

Submit feedback for a delivered report.

### `POST /knowledge/candidates`

Create a candidate knowledge entry from anonymized, consented, reviewed case information.

## Boundary

This draft does not define authentication, storage, or runtime implementation.
