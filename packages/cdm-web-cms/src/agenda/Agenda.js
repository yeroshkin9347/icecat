import { withLocalization } from "common/redux/hoc/withLocalization";
import { Col, Container, Row, Zone } from "cdm-ui-components";
import React, { useCallback, useEffect, useRef, useState } from "react";
import AgendaFiltersColumn, {
  DATES_OPTIONS,
} from "./filters/AgendaFiltersColumn";
import { getAgendaEventsForCms } from "cdm-shared/services/agenda";
import { get } from "lodash";
import moment from "moment";
import LoaderFixed from "cdm-shared/component/LoaderFixed";
import Calendars from "cdm-shared/component/calendars";
import { getAgendaCategoryCodesParamForFilter } from "cdm-shared/helper";

const Agenda = ({ translate }) => {
  const calendarRef = useRef();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    keyword: "",
    productCategory: [],
    editions: [],
    platforms: [],
    retailers: [],
    publicationStatus: [],
    dates: [DATES_OPTIONS[0]],
  });

  const [calendarDates, setCalendarDates] = useState({
    start: null,
    end: null,
  });

  const getFilterParams = useCallback(() => {
    const statuses = filters.publicationStatus
      ? filters.publicationStatus.map((statusOption) => statusOption.id)
      : [];
    return {
      Keyword: filters.keyword || undefined,
      CategoryCodes: getAgendaCategoryCodesParamForFilter(
        filters.productCategory
      ),
      editions: (filters.editions || []).map((edition) => get(edition, "code")),
      platforms: (filters.platforms || []).map((platform) =>
        get(platform, "code")
      ),
      retailers: (filters.retailers || []).map((retailer) =>
        get(retailer, "id")
      ),
      ProductStatuses: statuses,
    };
  }, [
    filters.publicationStatus,
    filters.keyword,
    filters.productCategory,
    filters.editions,
    filters.platforms,
    filters.retailers,
  ]);

  const fetchEvents = (params) => {
    setEvents([]);
    setLoading(true);
    getAgendaEventsForCms(params)
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
    const hasReleaseDate = filters.dates.find((d) => d.id === "releaseDate");
    const hasReviewDate = filters.dates.find((d) => d.id === "reviewDate");

    const startDate = moment(calendarDates.start).utcOffset(0, true).toJSON();
    const endDate = moment(calendarDates.end).utcOffset(0, true).toJSON();

    fetchEvents({
      ReviewDateStart: hasReviewDate ? startDate : undefined,
      ReviewDateEnd: hasReviewDate ? endDate : undefined,
      ReleaseDateStart: hasReleaseDate ? startDate : undefined,
      ReleaseDateEnd: hasReleaseDate ? endDate : undefined,
      ...getFilterParams(),
    });
  }, [calendarDates.start, calendarDates.end, getFilterParams, filters.dates]);

  const setFilterField = (field, val) => {
    setFilters({
      ...filters,
      [field]: val,
    });
  };

  return (
    <Zone style={{ overflow: "scroll" }}>
      {loading && <LoaderFixed />}
      <Container fluid>
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
              isCms
            />
          </Col>
        </Row>
      </Container>
    </Zone>
  );
};

export default withLocalization(Agenda);
