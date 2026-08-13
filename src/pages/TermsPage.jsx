import { Store, ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0F1A14] px-6 py-8 font-sans">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="flex items-center gap-1 text-[#8AA396] text-sm mb-6"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="flex items-center gap-2 mb-6">
        <div className="w-9 h-9 rounded-lg bg-[#3DDC84] flex items-center justify-center">
          <Store size={16} className="text-[#0F1A14]" strokeWidth={2.5} />
        </div>
        <span className="text-lg font-bold text-white">Shopvora</span>
      </div>

      <h1 className="text-white text-xl font-semibold mb-6">Seller Terms & Conditions</h1>

      <div className="space-y-5 text-[#8AA396] text-sm leading-relaxed">
        <p>By creating a store on Shopvora, you agree to the following:</p>

        <div>
          <h2 className="text-white font-medium mb-1.5">1. Shopvora is a listing tool, not a marketplace payment processor.</h2>
          <p>
            Shopvora provides you with a storefront to list and showcase your products. All communication, negotiation, and payment between you and your buyers happens directly between you and them (e.g. via WhatsApp, bank transfer, cash, or any method you choose). Shopvora does not collect, hold, process, or have any access to money exchanged between you and your buyers. You are fully responsible for handling your own payments and any disputes related to them.
          </p>
        </div>

        <div>
          <h2 className="text-white font-medium mb-1.5">2. You are responsible for your products.</h2>
          <p>
            You confirm that everything you list is legal to sell, accurately described, and priced honestly. You may not list counterfeit, stolen, dangerous, or prohibited items.
          </p>
        </div>

        <div>
          <h2 className="text-white font-medium mb-1.5">3. You are responsible for fulfilling orders.</h2>
          <p>
            Once a buyer contacts you and agrees to purchase, delivering the product and honoring the agreed price/terms is entirely your responsibility.
          </p>
        </div>

        <div>
          <h2 className="text-white font-medium mb-1.5">4. Shopvora may suspend or remove your store.</h2>
          <p>
            If your store is reported, found to be selling prohibited items, scamming buyers, or violating these terms, Shopvora may suspend or permanently remove your store without prior notice.
          </p>
        </div>

        <div>
          <h2 className="text-white font-medium mb-1.5">5. No guarantee of sales.</h2>
          <p>
            Shopvora provides the tools to sell online but does not guarantee any sales, traffic, or income.
          </p>
        </div>

        <div>
          <h2 className="text-white font-medium mb-1.5">6. Changes to these terms.</h2>
          <p>
            These terms may be updated as Shopvora grows. Continued use of your store after changes means you accept the updated terms.
          </p>
        </div>
      </div>
    </div>
  );
        }
