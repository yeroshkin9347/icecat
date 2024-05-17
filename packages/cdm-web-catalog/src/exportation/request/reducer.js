const ANALYSIS_STATUS = [ "Pending", "AnalysisOnGoing", "Analysed", "AnalysisFailed" ]
const ENRICHMENT_STATUS = [ "NotComplete", "Complete" ]
const MATCHING_STATUS = [ "NotComplete", "NotExisting", "Complete" ]
const EXPORT_STATUS = [ "NotExported", "Exported" ]

const enrichmentRequestDefaultFilters = {
    analysisStatus: [],
    enrichmentStatus: null
}

const enrichmentRequestDetailDefaultFilters = {
    gtin: null,
    manufacturerReference: null,
    manufacturerId: null,
    matchingStatus: [],
    exportStatus: null
}

export { enrichmentRequestDefaultFilters, 
    enrichmentRequestDetailDefaultFilters,
    ANALYSIS_STATUS,
    ENRICHMENT_STATUS,
    MATCHING_STATUS,
    EXPORT_STATUS
}
