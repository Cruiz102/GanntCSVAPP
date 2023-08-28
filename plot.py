import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from datetime import datetime

# Reading Data
df = pd.read_csv("data.csv")

# Convert Start and End to datetime objects
df['Start'] = pd.to_datetime(df['Start'])
df['End'] = pd.to_datetime(df['End'])

# Initialize Figure and Axes
fig, ax = plt.subplots()

# Priority color mapping
color_dict = {'High': 'red', 'Medium': 'yellow', 'Low': 'green'}

# Loop to plot tasks
for i, row in df.iterrows():
    color = color_dict.get(row['Priority'], 'blue')  # default color is blue
    ax.barh(row['Task'], 1, left=row['Start'], right=row['End'], color=color)
    # Annotate with the assigned person and description
    annotation = f"{row['AssignedTo']}: {row['Description']}"
    ax.text(row['Start'], i, annotation, verticalalignment='center')

# Formatting
ax.xaxis_date()
ax.xaxis.set_major_locator(mdates.MonthLocator())
ax.xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m'))

plt.show()
