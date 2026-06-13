import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUserStore } from '../store/userStore';
import { Check, Zap } from 'lucide-react';

export default function SubscriptionPage() {
  const { idToken } = useAuth();
  const { tier, upgradeSubscription } = useUserStore();
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'Forever',
      description: 'Perfect for getting started',
      credits: 5,
      prompts: 5,
      apps: 2,
      features: [
        '5 prompts per month',
        '2 app creations',
        'Hugging Face AI',
        'Basic support',
        'Community access'
      ],
      color: 'from-blue-500 to-cyan-500',
      badge: 'Starter'
    },
    {
      id: 'plus',
      name: 'Plus',
      price: '$4.99',
      period: '/month',
      description: 'For regular creators',
      credits: 25,
      prompts: 25,
      apps: 5,
      features: [
        '25 prompts per month',
        '5 app creations',
        'Gemini 2.5 Flash AI',
        'Priority support',
        'Ad-free experience',
        'Advanced analytics'
      ],
      color: 'from-purple-500 to-pink-500',
      badge: 'Popular',
      popular: true
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$9.99',
      period: '/month',
      description: 'For power users',
      credits: 60,
      prompts: 60,
      apps: 15,
      features: [
        '60 prompts per month',
        '15 app creations',
        'Gemini 2.5 Flash AI',
        'Premium support',
        'Ad-free experience',
        'Advanced analytics',
        'Custom branding',
        'API access'
      ],
      color: 'from-orange-500 to-red-500',
      badge: 'Professional'
    },
    {
      id: 'ultra',
      name: 'Ultra',
      price: '$19.99',
      period: '/month',
      description: 'For enterprises',
      credits: 100,
      prompts: 100,
      apps: 20,
      features: [
        '100 prompts per month',
        '20 app creations',
        'Gemini 2.5 Flash AI',
        '24/7 support',
        'Ad-free experience',
        'Advanced analytics',
        'Custom branding',
        'API access',
        'Team collaboration',
        'Dedicated account manager'
      ],
      color: 'from-yellow-500 to-orange-500',
      badge: 'Enterprise'
    }
  ];

  const handleUpgrade = async (planId) => {
    if (planId === 'free') return;

    setLoading(planId);
    setError(null);

    try {
      await upgradeSubscription(planId, idToken);
      alert(`Successfully upgraded to ${planId} plan!`);
    } catch (err) {
      setError(err.message || 'Failed to upgrade plan');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h1>
          <p className="text-slate-400 text-lg">Unlock unlimited potential with V Astra Create</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-8">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`card relative overflow-hidden transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-indigo-500 lg:scale-105' : ''
              } ${tier === plan.id ? 'ring-2 ring-green-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                  POPULAR
                </div>
              )}

              {tier === plan.id && (
                <div className="absolute top-0 left-0 bg-green-500 text-white px-3 py-1 text-xs font-bold rounded-br-lg">
                  CURRENT
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">{plan.name}</h2>
                <p className="text-slate-400 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400">{plan.period}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-2 mb-6 pb-6 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-yellow-400" />
                  <span className="text-sm text-slate-300">{plan.credits} credits/month</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-blue-400" />
                  <span className="text-sm text-slate-300">{plan.prompts} prompts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-purple-400" />
                  <span className="text-sm text-slate-300">{plan.apps} app creations</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Button */}
              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={tier === plan.id || loading === plan.id}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                  plan.id === 'free'
                    ? 'btn-secondary'
                    : tier === plan.id
                    ? 'btn-secondary opacity-50 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {tier === plan.id
                  ? 'Current Plan'
                  : loading === plan.id
                  ? 'Upgrading...'
                  : plan.id === 'free'
                  ? 'Downgrade'
                  : 'Upgrade Now'}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="card">
          <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-white mb-2">Can I change my plan anytime?</h3>
              <p className="text-slate-400">Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">What happens to my apps if I downgrade?</h3>
              <p className="text-slate-400">Your existing apps remain safe and accessible. You'll just have fewer monthly credits for new generations.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Do credits roll over?</h3>
              <p className="text-slate-400">No, credits reset every month. Unused credits expire at the end of the billing cycle.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Is there a free trial?</h3>
              <p className="text-slate-400">Yes! Start with our free plan and get 5 credits per month to try V Astra Create.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
