import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Save, Info } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { fetchDistributionSettings, saveDistributionSettings } from '../../services/firebase/wallet'
import type { DistributionSettings } from '../../types'
import { PageSpinner } from '../../components/ui/Spinner'
import toast from 'react-hot-toast'

const DEFAULTS: DistributionSettings = {
  journey_percent: 25,
  crest_percent: 25,
  company_percent: 50,
  crest_member_percent: 25,
  journey_fee_usd: 100,
  crest_single_fee: 100,
  crest_spouse_fee: 100,
  name_single_fee: 100,
  name_spouse_fee: 100,
}

export default function DistributionPage() {
  const [form, setForm] = useState<DistributionSettings>(DEFAULTS)

  const { data, isLoading } = useQuery({
    queryKey: ['distribution-settings'],
    queryFn: fetchDistributionSettings,
  })

  useEffect(() => {
    if (data) setForm(data)
  }, [data])

  const saveMutation = useMutation({
    mutationFn: (settings: DistributionSettings) => saveDistributionSettings(settings),
    onSuccess: () => toast.success('Distribution settings saved'),
    onError: () => toast.error('Failed to save settings'),
  })

  function handleChange(key: keyof DistributionSettings, value: string) {
    setForm((prev) => ({ ...prev, [key]: parseFloat(value) || 0 }))
  }

  const journeyTotal = (form.journey_percent ?? 0) + (form.crest_percent ?? 0) + (form.company_percent ?? 0)
  const totalValid = journeyTotal === 100

  // Live preview helpers
  const journeyFee = form.journey_fee_usd ?? 1
  const journeyPool = (journeyFee * (form.journey_percent ?? 0)) / 100
  const crestPool   = (journeyFee * (form.crest_percent ?? 0)) / 100
  const companyShare = (journeyFee * (form.company_percent ?? 0)) / 100

  if (isLoading) return <PageSpinner />

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Distribution Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Configure payment fees and distribution percentages</p>
      </div>

      {/* Payment Fees */}
      <Card title="Payment Fees (USD)">
        <p className="text-gray-400 text-xs mb-4">
          All amounts are in USD. Changes take effect immediately for new payments after saving.
        </p>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
            <Input
              label="Journey Fee (USD)"
              type="number"
              min="0"
              step="0.01"
              value={form.journey_fee_usd ?? ''}
              onChange={(e) => handleChange('journey_fee_usd', e.target.value)}
              hint="Required payment to join the journey"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Crest Single Fee (USD)"
              type="number"
              min="0"
              step="0.01"
              value={form.crest_single_fee ?? ''}
              onChange={(e) => handleChange('crest_single_fee', e.target.value)}
              hint="Individual crest celebration"
            />
            <Input
              label="Crest Spouse Fee (USD)"
              type="number"
              min="0"
              step="0.01"
              value={form.crest_spouse_fee ?? ''}
              onChange={(e) => handleChange('crest_spouse_fee', e.target.value)}
              hint="Joint crest celebration with partner"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Name Single Fee (USD)"
              type="number"
              min="0"
              step="0.01"
              value={form.name_single_fee ?? ''}
              onChange={(e) => handleChange('name_single_fee', e.target.value)}
              hint="Unlock own Crest Name"
            />
            <Input
              label="Name Spouse Fee (USD)"
              type="number"
              min="0"
              step="0.01"
              value={form.name_spouse_fee ?? ''}
              onChange={(e) => handleChange('name_spouse_fee', e.target.value)}
              hint="Unlock own + spouse Crest Name"
            />
          </div>
        </div>
      </Card>

      {/* Journey Distribution */}
      <Card title="Journey Payment Distribution">
        <div className="space-y-4">
          <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${totalValid ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>
              {totalValid
                ? '✓ Percentages are valid (total = 100%)'
                : `Total must equal 100%. Current: ${journeyTotal}%, adjust to proceed.`}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Journey Members %"
              type="number"
              min="0"
              max="100"
              value={form.journey_percent ?? ''}
              onChange={(e) => handleChange('journey_percent', e.target.value)}
              hint="Share for journey group members"
            />
            <Input
              label="Crest Members %"
              type="number"
              min="0"
              max="100"
              value={form.crest_percent ?? ''}
              onChange={(e) => handleChange('crest_percent', e.target.value)}
              hint="Share for crest group members"
            />
            <Input
              label="Company %"
              type="number"
              min="0"
              max="100"
              value={form.company_percent ?? ''}
              onChange={(e) => handleChange('company_percent', e.target.value)}
              hint="Platform earnings"
            />
          </div>
        </div>
      </Card>

      {/* Crest Distribution */}
      <Card title="Crest Payment Distribution">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Crest Members %"
              type="number"
              min="0"
              max="100"
              value={form.crest_member_percent ?? ''}
              onChange={(e) => handleChange('crest_member_percent', e.target.value)}
              hint="Distributed to existing crest members"
            />
            <Input
              label="Company %"
              type="number"
              min="0"
              max="100"
              value={100 - (form.crest_member_percent ?? 0)}
              readOnly
              hint="Automatically calculated"
            />
          </div>
        </div>
      </Card>

      {/* Live preview */}
      <Card title="Live Preview: Journey Payment Breakdown">
        <p className="text-gray-400 text-xs mb-4">
          Based on a ${journeyFee.toFixed(2)} journey fee with current percentages.
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-700">
            <span className="text-gray-300">Journey members pool ({form.journey_percent ?? 0}%)</span>
            <span className="text-green-400 font-mono font-semibold">${journeyPool.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-700">
            <span className="text-gray-300">Crest members pool ({form.crest_percent ?? 0}%)</span>
            <span className="text-green-400 font-mono font-semibold">${crestPool.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-300">Company ({form.company_percent ?? 0}%)</span>
            <span className="text-blue-400 font-mono font-semibold">${companyShare.toFixed(2)}</span>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button
          icon={<Save className="w-4 h-4" />}
          loading={saveMutation.isPending}
          onClick={() => saveMutation.mutate(form)}
          disabled={!totalValid}
          size="lg"
        >
          Save Settings
        </Button>
      </div>
    </div>
  )
}
