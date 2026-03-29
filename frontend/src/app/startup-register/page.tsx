'use client'

import { useAuthGuard } from '@/lib/useAuthGuard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Building2,
  Users,
  DollarSign,
  Shield,
  Briefcase,
  Clock,
  Download
} from 'lucide-react'

export default function StartupRegisterPage() {
  useAuthGuard()

  const registrationSteps = [
    {
      step: 1,
      title: 'Choose Business Structure',
      description: 'Select the appropriate legal structure for your startup',
      duration: '1-2 days',
      options: [
        { name: 'Private Limited Company', recommended: true, description: 'Most popular for startups seeking funding' },
        { name: 'Limited Liability Partnership (LLP)', recommended: false, description: 'Suitable for professional services' },
        { name: 'One Person Company (OPC)', recommended: false, description: 'For solo entrepreneurs' },
        { name: 'Sole Proprietorship', recommended: false, description: 'Simplest but no liability protection' }
      ]
    },
    {
      step: 2,
      title: 'Obtain Digital Signature Certificate (DSC)',
      description: 'Required for all directors to sign documents electronically',
      duration: '1-2 days',
      cost: '₹1,000-2,000 per director',
      documents: [
        'PAN Card of Directors',
        'Aadhaar Card of Directors',
        'Passport size photograph',
        'Email ID and Mobile Number'
      ]
    },
    {
      step: 3,
      title: 'Director Identification Number (DIN)',
      description: 'Unique identification number for company directors',
      duration: '1-2 days',
      cost: 'Free',
      documents: [
        'PAN Card',
        'Aadhaar Card',
        'Passport (if applicable)',
        'Address Proof (Utility Bill/Bank Statement)',
        'Passport size photograph'
      ]
    },
    {
      step: 4,
      title: 'Name Approval',
      description: 'Reserve your company name with the Registrar of Companies (RoC)',
      duration: '1-3 days',
      cost: '₹1,000',
      requirements: [
        'Propose 2-3 unique company names',
        'Names should not be similar to existing companies',
        'Avoid prohibited words without approval',
        'Check trademark availability'
      ]
    },
    {
      step: 5,
      title: 'Company Incorporation',
      description: 'File incorporation documents with MCA (Ministry of Corporate Affairs)',
      duration: '3-7 days',
      cost: '₹7,000-15,000',
      documents: [
        'Memorandum of Association (MOA)',
        'Articles of Association (AOA)',
        'Registered Office Address Proof',
        'Consent of Directors (Form DIR-2)',
        'Declaration by Professional (Form INC-8)',
        'PAN and TAN application'
      ]
    },
    {
      step: 6,
      title: 'PAN & TAN Registration',
      description: 'Obtain Permanent Account Number and Tax Deduction Account Number',
      duration: '7-15 days',
      cost: 'Included in incorporation',
      purpose: [
        'PAN: For income tax purposes',
        'TAN: For TDS (Tax Deducted at Source) compliance'
      ]
    },
    {
      step: 7,
      title: 'GST Registration',
      description: 'Register for Goods and Services Tax if turnover exceeds threshold',
      duration: '3-7 days',
      cost: 'Free',
      documents: [
        'Certificate of Incorporation',
        'PAN Card of Company',
        'Address Proof of Business',
        'Bank Account Statement',
        'Directors\' ID and Address Proof',
        'Digital Signature'
      ]
    },
    {
      step: 8,
      title: 'Open Business Bank Account',
      description: 'Open a current account in the company\'s name',
      duration: '3-5 days',
      documents: [
        'Certificate of Incorporation',
        'MOA and AOA',
        'PAN Card of Company',
        'Board Resolution for opening account',
        'Address Proof of Company',
        'Directors\' KYC documents'
      ]
    },
    {
      step: 9,
      title: 'DPIIT Registration (Optional)',
      description: 'Register with Department for Promotion of Industry and Internal Trade for startup benefits',
      duration: '2-4 weeks',
      cost: 'Free',
      benefits: [
        'Tax exemptions for 3 years',
        'Self-certification compliance',
        'IPR fast-tracking',
        'Access to government schemes',
        'Easier public procurement'
      ]
    },
    {
      step: 10,
      title: 'Compliance Setup',
      description: 'Set up ongoing compliance requirements',
      ongoing: true,
      requirements: [
        'Annual ROC filings (AOC-4, MGT-7)',
        'Income Tax Returns',
        'GST Returns (Monthly/Quarterly)',
        'TDS Returns (Quarterly)',
        'Board Meetings (Minimum 4 per year)',
        'Annual General Meeting (AGM)'
      ]
    }
  ]

  const essentialDocuments = [
    {
      category: 'Identity Proof',
      icon: Users,
      documents: ['PAN Card', 'Aadhaar Card', 'Passport', 'Voter ID', 'Driving License']
    },
    {
      category: 'Address Proof',
      icon: Building2,
      documents: ['Utility Bills (Electricity/Water/Gas)', 'Bank Statement', 'Rent Agreement', 'Property Tax Receipt']
    },
    {
      category: 'Business Documents',
      icon: Briefcase,
      documents: ['Business Plan', 'MOA & AOA', 'Certificate of Incorporation', 'PAN & TAN', 'GST Certificate']
    },
    {
      category: 'Financial Documents',
      icon: DollarSign,
      documents: ['Bank Account Details', 'Capital Investment Proof', 'Financial Projections', 'Funding Documents']
    }
  ]

  const totalCost = {
    government: '₹10,000-20,000',
    professional: '₹15,000-40,000',
    total: '₹25,000-60,000'
  }

  const timeline = '15-30 days'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold">Startup Registration Guide</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Complete step-by-step guide to register your startup in India
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold">Timeline</h3>
              </div>
              <p className="text-2xl font-bold text-purple-600">{timeline}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Average completion time</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold">Total Cost</h3>
              </div>
              <p className="text-2xl font-bold text-green-600">{totalCost.total}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Including all fees</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold">Steps</h3>
              </div>
              <p className="text-2xl font-bold text-blue-600">{registrationSteps.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Registration steps</p>
            </CardContent>
          </Card>
        </div>

        {/* Registration Steps */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-purple-600" />
            Registration Process
          </h2>

          <div className="space-y-6">
            {registrationSteps.map((step) => (
              <Card key={step.step} className="bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                          {step.step}
                        </div>
                        <CardTitle className="text-xl">{step.title}</CardTitle>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 ml-13">{step.description}</p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      {step.duration && (
                        <Badge variant="outline" className="border-blue-600 text-blue-600">
                          <Clock className="w-3 h-3 mr-1" />
                          {step.duration}
                        </Badge>
                      )}
                      {step.cost && (
                        <Badge variant="outline" className="border-green-600 text-green-600">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {step.cost}
                        </Badge>
                      )}
                      {step.ongoing && (
                        <Badge className="bg-orange-600 text-white">
                          Ongoing
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {step.options && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Options:</h4>
                      {step.options.map((option, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <CheckCircle className={`w-5 h-5 mt-0.5 ${option.recommended ? 'text-green-600' : 'text-gray-400'}`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{option.name}</span>
                              {option.recommended && (
                                <Badge className="bg-green-600 text-white text-xs">Recommended</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{option.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {step.documents && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">Required Documents:</h4>
                      <div className="grid md:grid-cols-2 gap-2">
                        {step.documents.map((doc, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <FileText className="w-4 h-4 text-purple-600" />
                            <span>{doc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {step.requirements && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">Requirements:</h4>
                      <ul className="space-y-2">
                        {step.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {step.purpose && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">Purpose:</h4>
                      <ul className="space-y-2">
                        {step.purpose.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {step.benefits && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">Benefits:</h4>
                      <ul className="space-y-2">
                        {step.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Essential Documents */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-600" />
            Essential Documents Checklist
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {essentialDocuments.map((category, idx) => {
              const Icon = category.icon
              return (
                <Card key={idx} className="bg-white dark:bg-gray-800 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-purple-600" />
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.documents.map((doc, docIdx) => (
                        <li key={docIdx} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Cost Breakdown */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              Cost Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <span className="font-semibold">Government Fees</span>
                <span className="text-lg font-bold text-green-600">{totalCost.government}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <span className="font-semibold">Professional Fees (CA/CS)</span>
                <span className="text-lg font-bold text-green-600">{totalCost.professional}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-600">
                <span className="font-bold text-lg">Total Estimated Cost</span>
                <span className="text-2xl font-bold text-purple-600">{totalCost.total}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <AlertCircle className="w-6 h-6" />
              Important Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
            <p>• It's recommended to hire a Chartered Accountant (CA) or Company Secretary (CS) for smooth registration</p>
            <p>• Keep digital and physical copies of all documents</p>
            <p>• Ensure all information provided is accurate to avoid rejection</p>
            <p>• Timeline may vary based on document verification and government processing</p>
            <p>• Some steps can be done in parallel to save time</p>
            <p>• Maintain compliance from day one to avoid penalties</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
