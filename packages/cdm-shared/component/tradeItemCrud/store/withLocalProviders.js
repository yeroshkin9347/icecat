import React from "react";
import PropertyGroupProvider from "./PropertyGroupProvider";
import TradeItemProvider from "./TradeItemProvider";
import TradeItemPropertiesProvider from "./TradeItemPropertiesProvider";
import ValuesGroupProvider from "./ValuesGroupProvider";
import TargetMarketProvider from "./TargetMarketProvider";
import RetailerProvider from "./RetailerProvider";
import LanguageProvider from "./LanguageProvider";
import TranslationProvider from "./TranslationProvider";
import LastActionProvider from "./LastActionProvider";
import EditionProvider from "./EditionProvider";
import PlatformProvider from "./PlatformProvider";
import { UpdateEnrichmentQueueProvider } from "../enrichmentManagement/useEnrichmentUpdate";

const withLocalProviders = (WrappedComponent) => (props) =>
  (
    <LanguageProvider>
      <PlatformProvider>
        <EditionProvider>
          <TargetMarketProvider>
            <RetailerProvider>
              <LastActionProvider>
                <PropertyGroupProvider>
                  <TradeItemProvider>
                    <UpdateEnrichmentQueueProvider>
                      <TradeItemPropertiesProvider>
                        <ValuesGroupProvider>
                          <TranslationProvider>
                            <WrappedComponent {...props} />
                          </TranslationProvider>
                        </ValuesGroupProvider>
                      </TradeItemPropertiesProvider>
                    </UpdateEnrichmentQueueProvider>
                  </TradeItemProvider>
                </PropertyGroupProvider>
              </LastActionProvider>
            </RetailerProvider>
          </TargetMarketProvider>
        </EditionProvider>
      </PlatformProvider>
    </LanguageProvider>
  );

export default withLocalProviders;
