import dash
from dash import dcc, html
import plotly.express as px
import pandas as pd

# 1) Load data
df = pd.read_csv('global_temp.csv')

# 2) Build the Dash app
app = dash.Dash(__name__, title="Global Temp Explorer")

fig = px.choropleth(
    df,
    locations='country',
    locationmode='country names',
    color='temp_anomaly',
    hover_name='country',
    animation_frame='year',
    range_color=[df.temp_anomaly.min(), df.temp_anomaly.max()],
    labels={'temp_anomaly': 'Temp Anomaly (°C)'},
    title="Global Temperature Anomalies Over Time"
)

app.layout = html.Div(style={'font-family': 'Arial, sans-serif', 'max-width': '1200px', 'margin': 'auto'}, children=[
    html.H1("🌍 Climate Data Explorer", style={'textAlign': 'center'}),
    html.P("Use the slider below to watch how temperature anomalies change by country.", style={'textAlign': 'center'}),
    dcc.Graph(id='choropleth', figure=fig),
    html.P("Data source: synthetic demo data", style={'fontSize': '0.8em', 'textAlign': 'right'})
])

# 4) Run
if __name__ == '__main__':
    app.run_server(debug=True)
