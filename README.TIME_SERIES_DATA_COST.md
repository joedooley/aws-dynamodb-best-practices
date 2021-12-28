## Time Series Data Cost Optimization Pattern

Times series data typically has a characteristic that only the recent data is accessed most frequently.
The older the data it is, the less frequently it is needed.
**You can optimize this for cost saving by having a new table for each period.**
You set higher read/write capacity for tables with more recent data and decrease it when it gets older.
