# File Upload Guide

This guide covers everything you need to know about uploading data files to Chart GPT and generating charts from your own data.

## Supported File Formats

Chart GPT supports four main file formats for data upload:

### CSV (Comma-Separated Values)
- **File Extension**: `.csv`
- **Best For**: Spreadsheet exports, analytics data, sales reports
- **Parsing**: Headers are automatically detected, numeric values are converted
- **Size Limit**: Recommended under 10MB for optimal performance

**Example CSV Structure:**
```csv
Date,Revenue,Customers,Conversion Rate
2024-01,125000,450,2.3
2024-02,138000,520,2.8
2024-03,142000,580,3.1
```

### JSON (JavaScript Object Notation)
- **File Extension**: `.json`
- **Best For**: API responses, structured data, nested objects
- **Parsing**: Supports arrays of objects and nested structures
- **Size Limit**: Recommended under 5MB for optimal performance

**Example JSON Structure:**
```json
[
  {
    "product": "Widget A",
    "sales": 1200,
    "region": "North America",
    "quarter": "Q1"
  },
  {
    "product": "Widget B",
    "sales": 850,
    "region": "Europe",
    "quarter": "Q1"
  }
]
```

**Alternative JSON Structure (with data property):**
```json
{
  "data": [
    {"month": "Jan", "value": 100},
    {"month": "Feb", "value": 150}
  ],
  "metadata": {
    "source": "analytics_api",
    "generated": "2024-01-15"
  }
}
```

### TSV (Tab-Separated Values)
- **File Extension**: `.tsv`
- **Best For**: Database exports, large datasets with tab delimiters
- **Parsing**: Similar to CSV but uses tabs instead of commas
- **Size Limit**: Recommended under 10MB for optimal performance

**Example TSV Structure:**
```tsv
Product	Category	Price	Stock
Laptop	Electronics	999.99	45
Mouse	Electronics	29.99	120
Keyboard	Electronics	79.99	85
```

### TXT (Plain Text)
- **File Extension**: `.txt`
- **Best For**: Simple datasets, log files, custom delimiter files
- **Parsing**: Auto-detects delimiters (comma, tab, semicolon, pipe)
- **Fallback**: If no delimiters detected, creates line-by-line data

**Example TXT with Auto-Detection:**
```txt
Name;Age;City;Score
John;25;New York;85
Jane;30;Los Angeles;92
Bob;28;Chicago;78
```

## How File Upload Works

### Step 1: Choose Upload Mode
1. Navigate to the main Chart GPT interface
2. Click the "Upload File" tab in the input method selector
3. The interface switches to file upload mode

### Step 2: Upload Your File
**Drag & Drop:**
- Drag your file from your computer directly onto the upload area
- The area will highlight when a file is being dragged over it
- Release to upload

**Click to Browse:**
- Click anywhere in the upload area
- A file browser dialog will open
- Select your file and click "Open"

### Step 3: File Processing
Once uploaded, Chart GPT will:
1. **Parse the file** using the appropriate parser for the file type
2. **Detect data types** for each column (numeric, text, date)
3. **Generate a preview** showing:
   - File name and size
   - Number of rows and columns
   - Column names
   - Sample data (first 3 rows)
4. **Display any errors** if the file cannot be parsed

### Step 4: Optional Chart Instructions
After successful file upload:
- Add optional instructions in the text area
- Examples:
  - "Show this as a line chart focusing on trends over time"
  - "Create a pie chart for the category breakdown"
  - "Use a bar chart and highlight the top performers"
  - "Make it a scatter plot to show correlations"

### Step 5: Generate Chart
Click "Generate Chart from Data" to:
1. **Analyze your data structure** using AI
2. **Select optimal chart type** based on data types and relationships
3. **Create the visualization** with appropriate formatting
4. **Apply smart defaults** for colors, labels, and styling

## Smart Chart Selection

Chart GPT automatically chooses the best chart type based on your data:

### Bar Charts
**When used:**
- One categorical column + one numeric column
- Comparing values across categories
- Sales by product, performance by team, etc.

**Example data structure:**
```csv
Product,Sales
Widget A,1200
Widget B,850
Widget C,950
```

### Line Charts
**When used:**
- Time-series data with dates/sequential values
- Trend analysis over time
- Multiple numeric columns for comparison

**Example data structure:**
```csv
Month,Revenue,Profit
Jan,100000,15000
Feb,120000,18000
Mar,110000,16500
```

### Pie Charts
**When used:**
- Small datasets (≤20 rows)
- Part-to-whole relationships
- Categorical data with values

**Example data structure:**
```csv
Region,Market Share
North America,42
Europe,28
Asia Pacific,18
```

### Scatter Plots
**When used:**
- Two or more numeric columns
- Correlation analysis
- Relationship exploration

**Example data structure:**
```csv
Advertising Spend,Revenue,Customer Count
5000,125000,450
7500,160000,580
10000,195000,720
```

## Data Processing Details

### Automatic Data Type Detection
Chart GPT intelligently detects column types:

**Numeric Columns:**
- Integers: `123`, `-45`, `0`
- Decimals: `99.99`, `-12.5`, `0.001`
- Currency: `$1,234.56` (strips formatting)
- Percentages: `45%` (converts to decimal)

**Date Columns:**
- ISO format: `2024-01-15`
- US format: `01/15/2024`
- Text dates: `January 15, 2024`
- Relative: `Q1 2024`, `Week 1`

**Text/Category Columns:**
- Product names, regions, categories
- Status values: `Active`, `Pending`, `Complete`
- Classifications: `High`, `Medium`, `Low`

### Data Validation
Before processing, Chart GPT validates:
- **File size**: Warns if file is very large
- **Data completeness**: Checks for empty rows/columns
- **Column consistency**: Ensures consistent data types
- **Parsing errors**: Reports any formatting issues

### Error Handling
Common file upload errors and solutions:

**"File parsing failed"**
- Check file encoding (UTF-8 recommended)
- Ensure consistent delimiter usage
- Verify file isn't corrupted

**"No data found"**
- File may be empty or contain only headers
- Check for hidden characters or wrong encoding

**"Unsupported file format"**
- Only CSV, JSON, TXT, TSV are supported
- Convert Excel files to CSV before uploading

**"Too many rows/columns"**
- Recommended limits: 10,000 rows, 50 columns
- Consider sampling your data for large datasets

## Best Practices

### Data Preparation
1. **Clean headers**: Use descriptive, single-word column names
2. **Consistent formatting**: Same date format, number format throughout
3. **Remove empty rows**: Delete any blank rows in your data
4. **Merge cells**: Avoid merged cells in spreadsheets before export

### Optimal File Structure
```csv
✅ Good:
Date,Revenue,Region
2024-01,125000,North
2024-02,130000,South

❌ Avoid:
,Revenue,$,
Date,,Region,
2024-01,,125000,North,
,130000,,
```

### File Size Optimization
- **Sample large datasets**: Use representative samples for exploration
- **Remove unnecessary columns**: Include only relevant data
- **Compress if needed**: Use ZIP for very large files (then extract)

### Chart Type Hints
Include keywords in your optional prompt to guide chart selection:
- **"trend"**, **"over time"** → Line chart
- **"compare"**, **"by category"** → Bar chart  
- **"distribution"**, **"breakdown"** → Pie chart
- **"correlation"**, **"relationship"** → Scatter plot

## Troubleshooting

### Common Issues

**File won't upload**
- Check file size (under 10MB recommended)
- Verify file extension (.csv, .json, .txt, .tsv)
- Try refreshing the page

**Data preview looks wrong**
- Check delimiter in TXT files
- Verify encoding (should be UTF-8)
- Look for special characters in headers

**Chart doesn't match expectations**
- Add specific instructions in the prompt
- Check data types in preview
- Ensure numeric columns are detected correctly

**Poor chart quality**
- Verify data has clear relationships
- Remove empty or irrelevant columns
- Consider data aggregation for large datasets

### Getting Help
If you encounter issues:
1. Check the data preview for parsing errors
2. Try a smaller sample of your data first
3. Verify file format matches examples above
4. Contact support with specific error messages

## Advanced Features

### Multiple File Handling
- Upload files one at a time
- Previous uploads are cleared when uploading new files
- Each file generates a separate chart

### Data Privacy
- All file processing happens in your browser
- Files are not stored on our servers
- Data is only sent to AI providers for chart generation
- You maintain full control of your data

### Export Options
After generating a chart from uploaded data:
- **PNG**: High-resolution for presentations
- **JPG**: Compressed for web use
- **SVG**: Vector format for scaling
- **PDF**: Print-ready format

### Customization
Generated charts can be fully customized:
- **Colors**: Choose from 10+ predefined palettes
- **Typography**: Adjust fonts, sizes, weights
- **Layout**: Modify spacing, padding, alignment
- **Animations**: Control timing and effects
- **Responsive**: Optimize for different screen sizes