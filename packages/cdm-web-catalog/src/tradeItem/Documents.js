import React from 'react'
import get from 'lodash/get'
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
import { H3, Zone, Row, Col, Padding, P } from 'cdm-ui-components';
import DocumentCard from './documents/DocumentCard';


class Documents extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            documents: []
        }
    }

    componentDidUpdate(prevProps) {

        const { tradeItem } = this.props

        if(get(tradeItem, 'tradeItemId') && get(tradeItem, 'tradeItemId') !== get(prevProps, 'tradeItem.tradeItemId')) {
            const documents = filter(map(get(tradeItem, 'documentResourceMetadatas', []), documentMetadata => get(documentMetadata, "values.0", null)))
            this.setState({ 
                documents
            })
        }
    }

    render() {

        const { documents } = this.state

        const { tradeItem } = this.props

        const { translate } = this.props
        
        if (!tradeItem) return <React.Fragment />

        return (
            <Zone
                style={{
                    boxShadow: 'rgba(0, 0, 0, 0.25) 0px 0px 30px 0px',
                    minWidth: '50%',
                    minHeight: '300px',
                    maxWidth: '1500px',
                    margin: '0 auto'
                }}
                responsive
                borderRadius
                >

                <H3>{translate('tradeitem.documents.title')}</H3>

                {isEmpty(documents) && <P lead>{translate(`tradeitem.empty.documents`)}</P>}

                <Padding vertical={3}>
                    <Row>
                        {map(documents, (doc, k) => (
                            <Col 
                                col={3}
                                key={`trade-item-doc-section-${k}`}
                                >
                                <Padding bottom={3}>
                                    <DocumentCard
                                        doc={doc}
                                        translate={translate}
                                        />
                                </Padding>
                            </Col>
                        ))}
                    </Row>
                </Padding>
                
            </Zone>
        )

    }

}



export default Documents
