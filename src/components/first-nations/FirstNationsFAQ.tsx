"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/Accordion";
import { ExternalLink, P } from "@/components/Layout";
import { Trans } from "@lingui/react/macro";

export function FirstNationsFAQ() {
  const faqs = [
    {
      question: "What is included in this First Nations Financial dataset?",
      answer: (
        <>
          <P>
            This dataset includes publicly available financial data reported
            under the{" "}
            <ExternalLink href="https://fnp-ppn.aadnc-aandc.gc.ca/fnp/Main/Search/SearchFF.aspx">
              First Nations Financial Transparency Act
            </ExternalLink>{" "}
            (FNFTA) and Land Claims data from the{" "}
            <ExternalLink href="https://services.aadnc-aandc.gc.ca/scbri_e/main/reportingcentre/external/externalreporting.aspx">
              Reporting Centre on Specific Claims
            </ExternalLink>
            .
          </P>
          <P>
            It shows the financial position of individual First Nations as per
            publicly disclosed and audited financial statements.
          </P>
          <P>
            The dataset is not complete as there are some First Nations that
            have not yet submitted financial reports, as required under the Act.
            Additionally, First Nations who have self-governing status are
            exempt from publishing their annual reports to the FNFTA web portal;
            they may be available on their own website, but we have not verified
            or processed them.
          </P>
        </>
      ),
    },
    {
      question: <Trans>Why are there no Inuit nations from Nunavut?</Trans>,
      answer: (
        <P>
          <Trans>
            Nunavut itself was created for the Inuit for their own
            self-governance and is therefore exempt from the FNFTA. Nunavut was
            separated officially from the Northwest Territories on April 1,
            1999, via the Nunavut Act and the Nunavut Land Claims Agreement Act,
            which provided this territory to the Inuit for self-government.
          </Trans>
        </P>
      ),
    },
    {
      question: "Why does this tool exist?",
      answer: (
        <P>
          First Nations funding is spread across many federal and provincial
          departments and reporting systems. That fragmentation makes it hard to
          see what was promised, what was delivered, and where delays or gaps
          exist. This tool makes those funding flows easier to find, understand,
          and track.
        </P>
      ),
    },
    {
      question: "Why include First Nations funding in Canada Spends?",
      answer: (
        <>
          <P>
            We believe that every Canadian should have access to tools to
            understand how their governments operate, this includes First
            Nations communities.
          </P>
          <P>
            Transparency should apply consistently across government spending.
          </P>
          <P>
            This makes financial data that is already publicly available more
            accessible to members of First Nations communities and the public at
            large.
          </P>
        </>
      ),
    },
    {
      question: "Does this tool interpret spending data?",
      answer: (
        <P>
          No. The tool tracks the financial position of First Nations, as
          publicly reported under the FNFTA. It doesn't analyze or assess
          community decisions on how funds are used. Canada Spends publishes raw
          data without commentary or judgment so everyone is working from the
          same factual baseline.
        </P>
      ),
    },
    {
      question: "What this tool is not",
      answer: (
        <>
          <P>This tool is not:</P>
          <ul className="list-disc list-inside space-y-1 mt-2 text-gray-700">
            <li>an audit of Indigenous governments</li>
            <li>a performance ranking</li>
            <li>a commentary on how funds are spent</li>
          </ul>
          <P className="mt-4">
            It is a transparency layer for existing federal disclosures.
          </P>
          <P>
            Questions or feedback?{" "}
            <ExternalLink href="mailto:brendan@buildcanada.com">
              Contact us
            </ExternalLink>
            .
          </P>
        </>
      ),
    },
    {
      question: "How was this data processed?",
      answer: (
        <>
          <P>
            You can see the code directly in the{" "}
            <ExternalLink href="https://github.com/BuildCanada/CanadaSpends">
              Canada Spends GitHub Repository
            </ExternalLink>
            .
          </P>
          <P>
            We scraped each posted document and built a data processing and
            validation system to normalize the data into a machine-readable
            format to extract the data from the PDFs.
          </P>
          <P>
            Additionally, we have started normalizing government entities under
            a single ID system so that datasets are easier to join together from
            different publishers.
          </P>
        </>
      ),
    },
    {
      question: "What's next?",
      answer: (
        <>
          <P>
            <strong>Expanding the scope to municipalities</strong>
          </P>
          <P>
            We are currently collecting annual financial reports for every
            municipality in Canada to do the same analysis for them.
          </P>
          <P>
            <strong>Better reporting and visualizations</strong>
          </P>
          <P>
            We are working on building aggregates to visualize more of the data
            over time, incorporating population data to show per capita amounts
            for easier comparison between jurisdictions and incorporating Stats
            Canada census data to enable Canadians to hold their governments
            accountable for the results that they deliver.
          </P>
          <P>
            <strong>Support for exploring the data using LLMs</strong>
          </P>
          <P>
            We are working to make it easy to explore the dataset using popular
            AI tools like ChatGPT, Gemini, or Claude. By making high-quality,
            tested datasets available to AIs, they are much more likely to be
            accurate than pulling from the broader internet.
          </P>
        </>
      ),
    },
  ];

  return (
    <details className="group border border-gray-200 bg-gray-50 mb-8">
      <summary className="cursor-pointer px-6 py-4 font-semibold text-lg text-gray-900 hover:bg-gray-100 transition-colors list-none flex items-center justify-between">
        <span>Frequently Asked Questions</span>
        <svg
          className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </summary>
      <div className="px-6 pb-4">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger>
                <strong>{faq.question}</strong>
              </AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </details>
  );
}
