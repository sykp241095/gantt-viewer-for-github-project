# my-gantt-viewer

Online Gantt Graph based on GitHub Issues

## Usage

  Link issues to project. By default, the issue creation time will be used as task start time
   and issue milestone due time will be used as task due time.

   You can add modifiers in the issue body to override the behaviour:

   - `GanttStart: YYYY-MM-DD`
   - `GanttDue: YYYY-MM-DD`
   - `GanttDuration: Nd`: You can specify duration instead of due date. `d` denotes for days.
   - `GanttProgress: N%`

## Getting Started Locally

1. Start by:

   ```bash
   npm install
   npm start
   ```
