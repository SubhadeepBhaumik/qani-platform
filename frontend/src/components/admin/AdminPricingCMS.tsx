import React, { useState, useEffect } from 'react';

interface PricingPlan {
  id: string;
  sortOrder: number;
  name: string;
  price: number;
  credits: number;
  description: string;
  features: string;
  buttonText: string;
  isPopular: boolean;
  isActive: boolean;
  isCustomPricing: boolean;
  ctaAction: string;
}

const tok = () => localStorage.getItem('qani_auth_token');

export const AdminPricingCMS: React.FC<{ showToast?: (msg: string, type?: string) => void }> = ({ showToast }) => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const toast = (msg: string, type = 'success') => { if (showToast) showToast(msg, type); };

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/pricing-plans', { headers: { Authorization: `Bearer ${tok()}` } });
      const data = await res.json();
      setPlans(Array.isArray(data) ? data : []);
    } catch { toast('Failed to load plans', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPlans(); }, []);

  const updateField = (id: string, field: keyof PricingPlan, value: any) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const updateFeature = (planId: string, idx: number, value: string) => {
    setPlans(prev => prev.map(p => {
      if (p.id !== planId) return p;
      const arr = JSON.parse(p.features || '[]');
      arr[idx] = value;
      return { ...p, features: JSON.stringify(arr) };
    }));
  };

  const addFeature = (planId: string) => {
    setPlans(prev => prev.map(p => {
      if (p.id !== planId) return p;
      const arr = JSON.parse(p.features || '[]');
      arr.push('New feature');
      return { ...p, features: JSON.stringify(arr) };
    }));
  };

  const removeFeature = (planId: string, idx: number) => {
    setPlans(prev => prev.map(p => {
      if (p.id !== planId) return p;
      const arr = JSON.parse(p.features || '[]');
      arr.splice(idx, 1);
      return { ...p, features: JSON.stringify(arr) };
    }));
  };

  const savePlan = async (plan: PricingPlan) => {
    setSaving(plan.id);
    try {
      const res = await fetch(`/api/v1/admin/pricing-plans/${plan.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tok()}` },
        body: JSON.stringify({
          name: plan.name,
          price: Math.round(plan.price),
          credits: plan.credits,
          description: plan.description,
          features: plan.features,
          buttonText: plan.buttonText,
          isPopular: plan.isPopular,
          isActive: plan.isActive,
          isCustomPricing: plan.isCustomPricing,
          ctaAction: plan.ctaAction,
        }),
      });
      if (!res.ok) throw new Error();
      toast(`${plan.name} plan saved`);
    } catch { toast('Failed to save plan', 'error'); }
    finally { setSaving(null); }
  };

  if (loading) return <div className="p-6 text-gray-400">Loading pricing plans...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Pricing Plans</h2>
        <p className="text-sm text-gray-500 mt-1">Edit plan details. Changes reflect immediately on the homepage.</p>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {plans.map(plan => {
          const features: string[] = JSON.parse(plan.features || '[]');
          return (
            <div key={plan.id} className={`bg-white border-2 rounded-xl p-6 ${plan.isPopular ? 'border-blue-400' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-5">
                <span className="text-sm font-bold text-gray-700">{plan.name} (#{plan.sortOrder})</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                    <input type="checkbox" checked={plan.isPopular} onChange={e => updateField(plan.id, 'isPopular', e.target.checked)} />
                    Most Popular
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                    <input type="checkbox" checked={plan.isCustomPricing} onChange={e => updateField(plan.id, 'isCustomPricing', e.target.checked)} />
                    Custom Pricing (no $ amount)
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                    <input type="checkbox" checked={plan.isActive} onChange={e => updateField(plan.id, 'isActive', e.target.checked)} />
                    Visible
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Plan Name</label>
                  <input value={plan.name} onChange={e => updateField(plan.id, 'name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Button Text</label>
                  <input value={plan.buttonText} onChange={e => updateField(plan.id, 'buttonText', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Price (cents, 4900 = $49)</label>
                  <input type="number" value={plan.price} onChange={e => updateField(plan.id, 'price', parseInt(e.target.value, 10) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  <div className="text-xs text-gray-400 mt-0.5">= ${(plan.price / 100).toFixed(2)} AUD</div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Credits Included</label>
                  <input type="number" value={plan.credits} onChange={e => updateField(plan.id, 'credits', parseInt(e.target.value, 10) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">CTA Action</label>
                  <select value={plan.ctaAction} onChange={e => updateField(plan.id, 'ctaAction', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="checkout">Stripe Checkout</option>
                    <option value="contact_sales">Contact Sales</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea value={plan.description} onChange={e => updateField(plan.id, 'description', e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none" />
              </div>
              <div className="mb-5">
                <label className="block text-xs font-medium text-gray-600 mb-2">Features</label>
                <div className="space-y-2">
                  {features.map((f, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={f} onChange={e => updateFeature(plan.id, i, e.target.value)} className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm" />
                      <button onClick={() => removeFeature(plan.id, i)} className="px-2 text-red-400 hover:text-red-600 font-bold">×</button>
                    </div>
                  ))}
                  <button onClick={() => addFeature(plan.id)} className="text-xs text-blue-600 font-medium">+ Add feature</button>
                </div>
              </div>
              <button onClick={() => savePlan(plan)} disabled={saving === plan.id} className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {saving === plan.id ? 'Saving...' : `Save ${plan.name} Plan`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
