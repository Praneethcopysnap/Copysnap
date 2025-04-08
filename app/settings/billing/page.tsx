'use client';

import React, { useState } from 'react';
import SettingsPageLayout from '../../components/SettingsPageLayout';

interface Plan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  isCurrent?: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card';
  lastFour: string;
  expiryDate: string;
  isDefault: boolean;
}

interface BillingHistory {
  id: string;
  date: string;
  amount: string;
  status: 'paid' | 'pending' | 'failed';
  invoice: string;
}

export default function BillingPage() {
  const [plans] = useState([
    {
      id: 'starter',
      name: 'Starter',
      price: '$9.99',
      description: 'Perfect for individuals and small projects',
      features: [
        '1,000 words per month',
        '1 workspace',
        'Basic brand voice settings',
        'Email support'
      ],
      isCurrent: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$24.99',
      description: 'For professionals with advanced needs',
      features: [
        '10,000 words per month',
        '5 workspaces',
        'Advanced brand voice settings',
        'Priority support',
        'Basic integrations'
      ],
      isPopular: true,
      isCurrent: true
    },
    {
      id: 'business',
      name: 'Business',
      price: '$49.99',
      description: 'For teams and businesses of all sizes',
      features: [
        'Unlimited words',
        'Unlimited workspaces',
        'Advanced brand voice settings',
        'Priority support',
        'All integrations',
        'Team management',
        'Custom templates'
      ],
      isCurrent: false
    }
  ] as Plan[]);

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 'card1',
      type: 'card',
      lastFour: '4242',
      expiryDate: '12/2024',
      isDefault: true
    }
  ] as PaymentMethod[]);

  const [billingHistory] = useState([
    {
      id: 'inv-001',
      date: 'April 1, 2023',
      amount: '$24.99',
      status: 'paid',
      invoice: 'INV-2023-001'
    },
    {
      id: 'inv-002',
      date: 'March 1, 2023',
      amount: '$24.99',
      status: 'paid',
      invoice: 'INV-2023-002'
    },
    {
      id: 'inv-003',
      date: 'February 1, 2023',
      amount: '$24.99',
      status: 'paid',
      invoice: 'INV-2023-003'
    }
  ] as BillingHistory[]);

  const [showAddPayment, setShowAddPayment] = useState(false);

  const handleChangePlan = (planId: string) => {
    // In a real app, this would make an API call to change the plan
    alert(`Changed to ${planId} plan. This would trigger a payment flow in a real app.`);
  };

  const handleRemovePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
  };

  const handleMakeDefault = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };

  const handleAddPaymentMethod = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // In a real app, this would make an API call to add a payment method
    const newPaymentMethod: PaymentMethod = {
      id: `card${paymentMethods.length + 1}`,
      type: 'card',
      lastFour: '1234',
      expiryDate: '12/2025',
      isDefault: false
    };
    
    setPaymentMethods(prev => [...prev, newPaymentMethod]);
    setShowAddPayment(false);
  };

  return (
    <SettingsPageLayout
      title="Billing & Subscription"
      description="Manage your subscription plan and payment details"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Current Plan */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Current Plan</h2>
          
          <div className="bg-primary/5 border border-primary/20 rounded-md p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Pro Plan</h3>
                <p className="text-sm text-gray-600">$24.99/month, renews on May 1, 2023</p>
              </div>
              <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                Active
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map(plan => (
              <div 
                key={plan.id}
                className={`border rounded-lg p-4 relative ${
                  plan.isCurrent ? 'border-primary' : 'hover:border-gray-300'
                } ${plan.isPopular ? 'shadow-md' : ''}`}
              >
                {plan.isPopular && (
                  <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                    Popular
                  </span>
                )}
                
                <div className="text-center mb-4 mt-2">
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <div className="flex justify-center items-baseline my-2">
                    <span className="text-2xl font-bold">{plan.price}</span>
                    <span className="text-gray-500 text-sm">/month</span>
                  </div>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleChangePlan(plan.id)}
                  disabled={plan.isCurrent}
                  className={`w-full py-2 rounded-md text-center text-sm font-medium ${
                    plan.isCurrent 
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                >
                  {plan.isCurrent ? 'Current Plan' : 'Switch Plan'}
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Payment Methods</h2>
            <button 
              className="btn-secondary text-sm"
              onClick={() => setShowAddPayment(true)}
            >
              Add Payment Method
            </button>
          </div>
          
          {paymentMethods.length > 0 ? (
            <div className="space-y-4">
              {paymentMethods.map(method => (
                <div 
                  key={method.id}
                  className="flex justify-between items-center p-4 border rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">•••• •••• •••• {method.lastFour}</div>
                      <div className="text-sm text-gray-500">Expires {method.expiryDate}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {method.isDefault && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mr-3">
                        Default
                      </span>
                    )}
                    <div className="flex space-x-2">
                      {!method.isDefault && (
                        <button 
                          onClick={() => handleMakeDefault(method.id)}
                          className="text-sm text-gray-600 hover:text-gray-900"
                        >
                          Make Default
                        </button>
                      )}
                      <button 
                        onClick={() => handleRemovePaymentMethod(method.id)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No payment methods available
            </div>
          )}
          
          {showAddPayment && (
            <div className="mt-6 border-t pt-6">
              <h3 className="font-medium mb-4">Add New Payment Method</h3>
              <form onSubmit={handleAddPaymentMethod}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      id="cardNumber"
                      type="text"
                      className="input"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div>
                    <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                      Name on Card
                    </label>
                    <input
                      id="cardName"
                      type="text"
                      className="input"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label htmlFor="expiration" className="block text-sm font-medium text-gray-700 mb-1">
                      Expiration Date
                    </label>
                    <input
                      id="expiration"
                      type="text"
                      className="input"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                      CVC
                    </label>
                    <input
                      id="cvc"
                      type="text"
                      className="input"
                      placeholder="123"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddPayment(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Add Payment Method
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
        
        {/* Billing History */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Billing History</h2>
          
          {billingHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {billingHistory.map(item => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.date}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.amount}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : item.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <button className="text-primary hover:underline">
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No billing history available
            </div>
          )}
        </div>
      </div>
    </SettingsPageLayout>
  );
} 