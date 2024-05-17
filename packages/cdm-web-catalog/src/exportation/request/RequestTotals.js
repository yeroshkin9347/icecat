import React from 'react'
import get from 'lodash/get'
import { Row, Col, H3, Margin, Label, P } from 'cdm-ui-components';


const RequestTotals = ({
    enrichmentRequest,
    // functions
    translate
}) => {

    return (
        <>
            <H3>{translate('export.requestdetail.titletotal')}</H3>

            <Margin bottom={5}/>

            <Row>
                <Col col={6}>
                    <Label>{translate('export.requestdetail.totalRequestedTradeItems')}</Label>
                    <P>{get(enrichmentRequest, 'totalRequestedTradeItems')}</P>
                    <br/>
                </Col>
                <Col col={6}>
                    <Label>{translate('export.requestdetail.totalNotExistingTradeItems')}</Label>
                    <P>{get(enrichmentRequest, 'totalNotExistingTradeItems')}</P>
                    <br/>
                </Col>
                <Col col={6}>
                    <Label>{translate('export.requestdetail.totalMatchedTradeItems')}</Label>
                    <P>{get(enrichmentRequest, 'totalMatchedTradeItems')}</P>
                    <br/>
                </Col>
                <Col col={6}>
                    <Label>{translate('export.requestdetail.totalCompleteTradeItems')}</Label>
                    <P>{get(enrichmentRequest, 'totalCompleteTradeItems')}</P>
                    <br/>
                </Col>
                <Col col={6}>
                    <Label>{translate('export.requestdetail.totalNotCompleteTradeItems')}</Label>
                    <P>{get(enrichmentRequest, 'totalNotCompleteTradeItems')}</P>
                    <br/>
                </Col>
            </Row>
        </>
    )


}

export default RequestTotals
