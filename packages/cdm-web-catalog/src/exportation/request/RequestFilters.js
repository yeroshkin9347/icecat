import React, { useCallback } from 'react'
import { Row, Col, Label, Select, Button } from 'cdm-ui-components';
import { ANALYSIS_STATUS, ENRICHMENT_STATUS } from './reducer';

const RequestFilters = ({
    filters,
    refreshRef,
    // functions
    dispatch,
    translate,
}) => {

    const translateEnum = useCallback(val => translate(`export.enum.${val}`), [translate])

    return (
        <>
            <Row>

                {/* Enrichment status */}
                <Col col={4}>
                    <Label block>{translate('export.requests.enrichmentStatus')}</Label>
                    <Select
                        isClearable={true}
                        value={filters.enrichmentStatus}
                        onChange={value => dispatch({ type: 'setFilter', key: 'enrichmentStatus', value })}
                        simpleValue
                        getOptionLabel={translateEnum}
                        options={ENRICHMENT_STATUS}
                        />
                </Col>

                {/* Analysis status */}
                <Col col={4}>
                    <Label block>{translate('export.requests.analysisStatus')}</Label>
                    <Select
                        isClearable={true}
                        value={filters.analysisStatus}
                        onChange={values => dispatch({ type: 'setFilter', key: 'analysisStatus', value: values || [] })}
                        simpleValue
                        getOptionLabel={translateEnum}
                        isMulti
                        options={ANALYSIS_STATUS}
                        closeMenuOnSelect={false}
                        />
                </Col>

                {/* Actions */}
                <Col col={4} right>
                    <Label block>&nbsp;</Label>

                    {/* Clear filter */}
                    <Button
                        ref={refreshRef}
                        noMargin
                        onClick={e => dispatch({ type: 'resetFilters' })}
                        secondary
                        small
                        >
                        {translate('export.requests.clear')}
                        </Button>

                </Col>

            </Row>
        </>
    )

}

export default RequestFilters
