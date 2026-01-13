import {
  ExternalLink,
  H1,
  H2,
  H3,
  Intro,
  P,
  Page,
  PageContent,
  Section,
  UL,
} from "@/components/Layout";
import { initLingui, PageLangParam } from "@/initLingui";
import { generateHreflangAlternates } from "@/lib/utils";
import { Trans, useLingui } from "@lingui/react/macro";
import { PropsWithChildren } from "react";

export async function generateMetadata(
  props: PropsWithChildren<PageLangParam>,
) {
  const lang = (await props.params).lang;
  initLingui(lang);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useLingui();
  return {
    title: t`Whistleblowers | Secure Anonymous Tips | Canada Spends`,
    description: t`Submit anonymous tips securely using our encrypted whistleblower platform. Available via Tor for maximum privacy.`,
    alternates: generateHreflangAlternates(lang),
  };
}

export default async function Whistleblowers(
  props: PropsWithChildren<PageLangParam>,
) {
  const lang = (await props.params).lang;
  initLingui(lang);

  return (
    <Page>
      <PageContent>
        <Section>
          <H1>
            <Trans>Whistleblowers</Trans>
          </H1>
          <Intro>
            <Trans>
              Canada Spends provides a secure way for sources to submit tips and
              documents anonymously. Your identity is protected, and all
              communications are encrypted.
            </Trans>
          </Intro>
        </Section>

        <Section>
          <H2>
            <Trans>Why Submit a Tip?</Trans>
          </H2>
          <P>
            <Trans>
              Canada Spends is part of a movement that cares about government
              effectiveness and we are willing and able to speak up against
              corruption, fraud, self-dealing and negligence when others will
              not. When you submit a report, members of our core team will
              evaluate your submission, validate the authenticity of your
              documents and either publish the documents in whole or in part as
              part of a greater investigation.
            </Trans>
          </P>
        </Section>

        <Section>
          <H2>
            <Trans>How to Submit a Tip</Trans>
          </H2>

          <P>
            <Trans>
              You can access our whistleblower platform directly through your
              web browser at:
            </Trans>
          </P>
          <P className="font-mono bg-card p-4 rounded-lg break-all">
            <ExternalLink href="https://whistleblowers.canadaspends.com">
              https://whistleblowers.canadaspends.com
            </ExternalLink>
          </P>

          <H3 className="mt-8">
            <Trans>Want even more anonymity?</Trans>
          </H3>
          <P>
            <Trans>
              For maximum security and anonymity, access our platform through
              the Tor network. Tor encrypts your connection and hides your IP
              address.
            </Trans>
          </P>
          <P>
            <Trans>Steps to submit via Tor:</Trans>
          </P>
          <UL>
            <li>
              <Trans>
                Download and install the{" "}
                <ExternalLink href="https://www.torproject.org/download/">
                  Tor Browser
                </ExternalLink>{" "}
                from the official Tor Project website.
              </Trans>
            </li>
            <li>
              <Trans>Open Tor Browser and wait for it to connect.</Trans>
            </li>
            <li>
              <Trans>
                Copy and paste the following .onion address into the Tor
                Browser:
              </Trans>
            </li>
          </UL>
          <P className="font-mono bg-card p-4 rounded-lg break-all text-sm">
            http://wma7meetxlouufaeha47qcbrvjkzmqtcngsw6prjxvkkruf45nam37ad.onion
          </P>
        </Section>

        <Section>
          <H2>
            <Trans>What Makes a Good Tip?</Trans>
          </H2>
          <P>
            <Trans>
              Canada Spends is looking to expose fraud, corruption and
              negligence inside Canadian governments at the federal, provincial,
              municipal and indigenous levels. Documents or other evidence can
              be essential to that.
            </Trans>
          </P>
          <P>
            <Trans>
              Please articulate your information clearly and provide relevant
              names, documents, videos or pictures, highlighting any specific
              concerns you believe we should focus on.
            </Trans>
          </P>
          <P className="font-semibold">
            <Trans>Speculation does not meet the level of a strong tip.</Trans>
          </P>
        </Section>

        <Section>
          <H2>
            <Trans>Security Tips</Trans>
          </H2>
          <UL>
            <li>
              <Trans>
                Use a computer you trust, not one provided by your employer.
              </Trans>
            </li>
            <li>
              <Trans>
                Connect from a public network like a coffee shop or library, not
                your home or work network.
              </Trans>
            </li>
            <li>
              <Trans>
                For maximum protection, consider using{" "}
                <ExternalLink href="https://tails.net/">Tails OS</ExternalLink>,
                a privacy-focused operating system that runs from a USB drive.
              </Trans>
            </li>
            <li>
              <Trans>
                Save your receipt code securely—you will need it to check for
                responses and communicate with our team.
              </Trans>
            </li>
            <li>
              <Trans>
                Do not discuss your submission with anyone or search for related
                topics on work devices.
              </Trans>
            </li>
          </UL>
        </Section>

        <Section>
          <H2>
            <Trans>About GlobaLeaks</Trans>
          </H2>
          <P>
            <Trans>
              GlobaLeaks is an open-source, secure whistleblowing platform used
              by organizations worldwide, including media outlets,
              anti-corruption agencies, and public institutions. All submissions
              are encrypted end-to-end, and the platform is designed to protect
              the anonymity of sources.
            </Trans>
          </P>
          <P>
            <Trans>
              Learn more about the technology at{" "}
              <ExternalLink href="https://www.globaleaks.org/">
                globaleaks.org
              </ExternalLink>
              .
            </Trans>
          </P>
        </Section>

        <Section>
          <H2>
            <Trans>Important Notice</Trans>
          </H2>
          <P>
            <Trans>
              No form of electronic communication can be made 100% secure. While
              we take every precaution to protect your identity, you use this
              service at your own risk. We encourage you to take the security
              precautions outlined above.
            </Trans>
          </P>
          <P>
            <Trans>
              Canada Spends is committed to responsible journalism. We will
              carefully evaluate all submissions and may not respond to or
              publish every tip received.
            </Trans>
          </P>
        </Section>
      </PageContent>
    </Page>
  );
}
