import { withLocalization } from "common/redux/hoc/withLocalization";
import { Col, Container, Row } from "cdm-ui-components";
import Banner from "cdm-shared/component/Banner";
import React, { useCallback, useEffect, useRef, useState } from "react";
import AgendaFiltersColumn from "./filters/AgendaFiltersColumn";
import { getAgendaEventsForRetailer } from "cdm-shared/services/agenda";
import moment from "moment";
import LoaderFixed from "cdm-shared/component/LoaderFixed";
import Calendars from "cdm-shared/component/calendars";
import { getAgendaCategoryCodesParamForFilter } from "cdm-shared/helper";
import ActionBar from "styled-components/action-bar/ActionBar";
import { Breadcrumbs, Typography } from "@mui/material";
import { Link } from "react-router-dom/cjs/react-router-dom";

const Agenda = ({ translate }) => {
  const calendarRef = useRef();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    keyword: "",
    tradeItemManufacturerCode: "",
    gtin: "",
    productCategory: [],
  });
  const [calendarDates, setCalendarDates] = useState({
    start: null,
    end: null,
  });

  const getFilterParams = useCallback(
    () => ({
      Keyword: filters.keyword || undefined,
      gtin: filters.gtin || undefined,
      tradeItemManufacturerCode: filters.tradeItemManufacturerCode || undefined,
      CategoryCodes: getAgendaCategoryCodesParamForFilter(
        filters.productCategory
      ),
    }),
    [
      filters.gtin,
      filters.keyword,
      filters.productCategory,
      filters.tradeItemManufacturerCode,
    ]
  );

  const fetchEvents = (params) => {
    setEvents([]);
    setLoading(true);
    getAgendaEventsForRetailer(params)
      .then((res) => {
        setEvents(
          res.data.map((event, index) => {
            return {
              ...event,
              id: `${event.tradeItemId}-${index}`,
              groupId: event.productCategoryCode,
              allDay: event.isFullDay,
              start: moment(event.startTime).toDate(),
              end: moment(event.endTime).toDate(),
            };
          })
        );
      })
      .finally(() => setLoading(false));
  };

  const onChangeDatesHandler = useCallback(({ startStr, endStr }) => {
    setCalendarDates({ start: startStr, end: endStr });
  }, []);

  useEffect(() => {
    if (!calendarDates.start || !calendarDates.end) {
      return;
    }
    fetchEvents({
      ReleaseDateStart: moment(calendarDates.start).utcOffset(0, true).toJSON(),
      ReleaseDateEnd: moment(calendarDates.end).utcOffset(0, true).toJSON(),
      ...getFilterParams(),
    });
  }, [calendarDates.end, calendarDates.start, getFilterParams]);

  const setFilterField = (field, val) => {
    setFilters({
      ...filters,
      [field]: val,
    });
  };

  return (
    <>
      {loading && <LoaderFixed />}

      <ActionBar showProductSearch>
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">{translate("header.nav.home")}</Link>
          <Typography color="text.primary">
            {translate("agenda.title")}
          </Typography>
        </Breadcrumbs>
      </ActionBar>
      <Banner>
        <span>{translate("agenda.title")}</span>
      </Banner>

      <Container fluid style={{ padding: "50px 2rem" }}>
        <Row>
          <Col col={3}>
            <AgendaFiltersColumn
              translate={translate}
              filters={filters}
              setFilterField={setFilterField}
            />
          </Col>
          <Col col={9}>
            <Calendars
              ref={calendarRef}
              events={events}
              onChangeDates={onChangeDatesHandler}
              translate={translate}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default withLocalization(Agenda);
