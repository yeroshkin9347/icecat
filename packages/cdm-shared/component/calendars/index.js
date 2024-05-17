import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { Button, Col, Container, Row, Modal } from "cdm-ui-components";
import { toString } from "lodash";
import EventItem from "./EventItem";
import "./index.css";
import { forwardRef } from "react";
import { withLocalization } from "common/redux/hoc/withLocalization";
import useLocalization from "../../hook/useLocalization";

const calendarViewModes = {
  month: "dayGridMonth",
  week: "timeGridWeek",
  day: "timeGridDay",
  listDay: "listDay",
  listWeek: "listWeek",
  listMonth: "listMonth",
  listYear: "listYear",
};

const CALENDAR_HEIGHT = "80vh";

const calendarListModes = {
  calendar: "calendar",
  list: "list",
};

const Calendars = forwardRef(
  ({ events, onChangeDates, isCms = false, translate }, ref) => {
    const [calendarListMode, setCalendarListMode] = useState(
      calendarListModes.calendar
    );
    const [calendarViewMode, setCalendarViewMode] = useState(
      calendarViewModes.week
    );
    const [visibleModal, setVisibleModal] = useState(false);

    const calendarRef = useRef();

    const [locale] = useLocalization();

    useImperativeHandle(ref, () => ({
      gotoDate(startTime) {
        calendarRef.current && calendarRef.current.getApi().gotoDate(startTime);
      },
    }));

    const onChangeListViewHandler = () => {
      setCalendarListMode(calendarListModes.list);
      let listViewMode;
      switch (calendarViewMode) {
        case calendarViewModes.day:
          listViewMode = calendarViewModes.listDay;
          break;
        case calendarViewModes.week:
          listViewMode = calendarViewModes.listWeek;
          break;
        case calendarViewModes.month:
          listViewMode = calendarViewModes.listMonth;
          break;
        default:
          listViewMode = calendarViewModes.listWeek;
      }
      setCalendarViewMode(listViewMode);
    };

    const onChangeCalendarViewHandler = () => {
      setCalendarListMode(calendarListModes.calendar);
      setCalendarViewMode(calendarViewModes.week);
    };

    const renderEventContent = (eventInfo) => {
      const rawEvent = events.find(
        (e) => toString(e.id) === toString(eventInfo.event.id)
      );
      return (
        <EventItem eventInfo={eventInfo} rawEvent={rawEvent} isCms={isCms} />
      );
    };

    useEffect(() => {
      calendarRef.current &&
        calendarRef.current.getApi().changeView(calendarViewMode);
    }, [calendarViewMode]);

    return (
      <>
        <Container fluid>
          <Row>
            <Col col={12} style={{ paddingRight: 0 }}>
              {
                <>
                  <Row style={{ marginBottom: 12 }}>
                    <Col col={4}>
                      <Button
                        small
                        primary={
                          calendarListMode === calendarListModes.calendar
                        }
                        light={calendarListMode !== calendarListModes.calendar}
                        onClick={onChangeCalendarViewHandler}
                      >
                        {translate("agenda.calendar")}
                      </Button>
                      <Button
                        small
                        primary={calendarListMode === calendarListModes.list}
                        light={calendarListMode !== calendarListModes.list}
                        onClick={onChangeListViewHandler}
                      >
                        {translate("agenda.list")}
                      </Button>
                    </Col>
                    <Col
                      col={4}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      {calendarListMode === calendarListModes.calendar && (
                        <>
                          <Button
                            primary={
                              calendarViewMode === calendarViewModes.month
                            }
                            light={calendarViewMode !== calendarViewModes.month}
                            small
                            onClick={() =>
                              setCalendarViewMode(calendarViewModes.month)
                            }
                          >
                            {translate("agenda.month")}
                          </Button>
                          <Button
                            primary={
                              calendarViewMode === calendarViewModes.week
                            }
                            light={calendarViewMode !== calendarViewModes.week}
                            small
                            onClick={() =>
                              setCalendarViewMode(calendarViewModes.week)
                            }
                          >
                            {translate("agenda.week")}
                          </Button>
                          <Button
                            primary={calendarViewMode === calendarViewModes.day}
                            light={calendarViewMode !== calendarViewModes.day}
                            small
                            onClick={() =>
                              setCalendarViewMode(calendarViewModes.day)
                            }
                          >
                            {translate("agenda.day")}
                          </Button>
                        </>
                      )}
                    </Col>
                    <Col col={4}></Col>
                  </Row>
                  <FullCalendar
                    ref={calendarRef}
                    plugins={[
                      dayGridPlugin,
                      timeGridPlugin,
                      timeGridPlugin,
                      listPlugin,
                    ]}
                    initialView={calendarViewModes.week}
                    height={CALENDAR_HEIGHT}
                    events={events}
                    locale={locale}
                    eventContent={renderEventContent}
                    allDayText={translate("agenda.allday")}
                    buttonText={{
                      today: translate("agenda.today"),
                    }}
                    datesSet={(dateInfo) => {
                      onChangeDates && onChangeDates(dateInfo);
                    }}
                    allDayClassNames={
                      calendarListMode === calendarListModes.calendar
                        ? "allday-calendar"
                        : ""
                    }
                  />
                </>
              }
            </Col>
          </Row>
        </Container>
        {visibleModal && (
          <Modal md>
            <Container>
              <p>Example Modal</p>
              <Button onClick={(e) => setVisibleModal(false)} primary noMargin>
                Close
              </Button>
            </Container>
          </Modal>
        )}
      </>
    );
  }
);

export default withLocalization(Calendars);
