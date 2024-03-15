from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import pandas as pd

app = Flask(__name__)
CORS(app)

client = MongoClient('')
db = client['OlistDb']  
orders_payments_col = db['orders_payments']
customers_col = db['customer']
orders_col = db['orders']

@app.route('/')
def hello_world():
    return {'message': 'Hello, World!'}

@app.route('/api/revenue-by-state', methods=['GET'])
def get_revenue_by_state():
    orders_payments = pd.DataFrame(list(orders_payments_col.find()))
    customers = pd.DataFrame(list(customers_col.find()))
    orders = pd.DataFrame(list(orders_col.find()))
    merged_df = pd.merge(orders, orders_payments, on='order_id')
    final_df = pd.merge(merged_df, customers, on='customer_id')
    
    revenue_by_state = final_df.groupby('customer_state')['payment_value'].sum().reset_index()

    revenue_by_state_sorted = revenue_by_state.sort_values(by='payment_value', ascending=False)
    return jsonify(revenue_by_state_sorted.to_dict(orient='records'))

@app.route('/api/purchase-timestamp')
def get_purchase_timestamp_data():

    orders = pd.DataFrame(list(orders_col.find()))
    orders_df = orders.copy()

    orders_df['order_purchase_timestamp'] = pd.to_datetime(orders_df['order_purchase_timestamp'])

    # Group by month and count orders
    counts_by_month = orders_df.set_index("order_purchase_timestamp").groupby(pd.Grouper(freq='M')).count()

    # Group by year and count orders
    counts_by_year = orders_df.groupby(orders_df['order_purchase_timestamp'].dt.year).size().reset_index(name='count_year')

    # Group by month (as string) and count orders
    counts_by_month_str = orders_df.groupby(orders_df['order_purchase_timestamp'].dt.strftime('%b%Y')).size().reset_index(name='count_month_str')

    # Group by weekday and count orders
    counts_by_weekday = orders_df.groupby(orders_df['order_purchase_timestamp'].dt.day_name()).size().reset_index(name='count_weekday')

    # Prepare the data to be returned as JSON
    data = {
        'purchase_timestamp_monthly': counts_by_month.reset_index().rename(columns={'index': 'timestamp', 'order_purchase_timestamp': 'count_month'}).to_dict('records'),
        'counts_by_year': counts_by_year.to_dict('records'),
        'counts_by_month_str': counts_by_month_str.to_dict('records'),
        'counts_by_weekday': counts_by_weekday.to_dict('records')
    }

    return jsonify(data)
    



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
