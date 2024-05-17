import React, { useState, useEffect, useCallback, useMemo } from "react";
import map from "lodash/map";
import join from "lodash/join";
import find from "lodash/find";
import orderBy from "lodash/orderBy";
import usePaginatedData from "cdm-shared/hook/usePaginatedData";
import {
  H3,
  Input,
  Select,
  Icon,
  RoundedButton,
  Zone,
} from "cdm-ui-components";
import Datatable from "common/component/datatable/Datatable";
import { getCmsMessages } from "cdm-shared/services/messaging";
import { withLocalization } from "common/redux/hoc/withLocalization";
import StyledLink from "cdm-shared/component/Link";
import { getCollectionsForCms } from "cdm-shared/services/collection";
import { ic_delete } from "react-icons-kit/md/ic_delete";
import { getRetailersAllLight } from "cdm-shared/services/retailer";
import { getAllManufacturers } from "cdm-shared/services/manufacturer";
import { smartDateParse } from "cdm-shared/utils/date";

const DEFAULT_PAGE_SIZE = 50;
const DEFAULT_BODY_LENGTH = 30;
const DEFAULT_FILTERS = {
  senderId: null,
  recipientId: null,
  tags: null,
  subject: null,
  isRead: null,
};

function UserMessages({ translate }) {
  const [messages, fetchMessages] = usePaginatedData({
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [collections, setCollections] = useState([]);
  const [recipients, setRecipients] = useState([]);

  // fetch messages
  const search = useCallback(
    (pageNumber, pageSize, f) => {
      const promise = getCmsMessages(
        pageNumber,
        pageSize,
        DEFAULT_BODY_LENGTH,
        f
      );

      return fetchMessages(promise, pageNumber, pageSize);
    },
    [fetchMessages]
  );

  // on filter changed/component mount
  useEffect(() => {
    search(0, DEFAULT_PAGE_SIZE, filters);
  }, [search, filters]);

  // set collections
  useEffect(() => {
    getCollectionsForCms().then((res) => setCollections(res.data));
  }, []);

  // set recipients
  useEffect(() => {
    Promise.all([getRetailersAllLight(), getAllManufacturers()]).then(
      ([retailers, manufacturers]) => {
        setRecipients(
          orderBy(
            [
              ...map(retailers.data, (r) => ({
                ...r,
                discriminator: "Retailer",
              })),
              ...map(manufacturers.data, (m) => ({
                ...m,
                discriminator: "Manufacturer",
              })),
            ],
            ["name"],
            ["asc"]
          )
        );
      }
    );
  }, []);

  // memoized values
  // selected collection in filter
  const selectedCollection = useMemo(
    () => find(collections, (c) => c.name === filters.tags) || null,
    [collections, filters.tags]
  );

  // selected recipient in filter
  const selectedRecipient = useMemo(
    () => find(recipients, (c) => c.id === filters.recipientId) || null,
    [recipients, filters.recipientId]
  );

  // selected sender in filter
  const selectedSender = useMemo(
    () => find(recipients, (c) => c.id === filters.senderId) || null,
    [recipients, filters.senderId]
  );

  //   filter on subject
  const SubjectFilter = useMemo(() => {
    return (
      <Input
        block
        value={filters.subject || ""}
        onChange={(e) => {
          const v = e.currentTarget.value;
          setFilters((f) => ({ ...f, subject: v }));
        }}
      />
    );
  }, [filters.subject]);

  //   filter on recipients
  const RecipientFilter = useMemo(() => {
    return (
      <Select
        onChange={(o) => {
          setFilters((f) => ({
            ...f,
            recipientId: o ? o.id : null,
          }));
        }}
        value={selectedRecipient}
        options={recipients}
        getOptionLabel={(o) => o.name}
        getOptionValue={(o) => o.id}
        isClearable={true}
      />
    );
  }, [selectedRecipient, recipients]);

  //   filter on sender
  const SenderFilter = useMemo(() => {
    return (
      <Select
        onChange={(o) => {
          setFilters((f) => ({
            ...f,
            senderId: o ? o.id : null,
          }));
        }}
        value={selectedSender}
        options={recipients}
        getOptionLabel={(o) => o.name}
        getOptionValue={(o) => o.id}
        isClearable={true}
      />
    );
  }, [selectedSender, recipients]);

  // filter on tags
  const TagsFilter = useMemo(() => {
    return (
      <Select
        onChange={(o) => {
          setFilters((f) => ({
            ...f,
            tags: o ? o.name : null,
          }));
        }}
        value={selectedCollection}
        options={collections}
        getOptionLabel={(o) => o.name}
        getOptionValue={(o) => o.id}
        isClearable={true}
      />
    );
  }, [selectedCollection, collections]);

  const columns = useMemo(() => {
    return [
      {
        Header: translate("messaging.table.information"),
        columns: [
          {
            Header: translate("messaging.table.id"),
            accessor: "id",
          },
          {
            Header: translate("messaging.table.creationTimestamp"),
            id: "creationTimestamp",
            accessor: (d) => smartDateParse(d.creationTimestamp),
          },
        ],
      },
      {
        Header: translate("messaging.table.sender"),
        columns: [
          {
            Header: translate("messaging.table.senderName"),
            accessor: "sender.username",
          },
          {
            Header: translate("messaging.table.senderCompanyName"),
            Filter: SenderFilter,
            accessor: "sender.companyName",
          },
        ],
      },
      {
        Header: translate("messaging.table.recipients"),
        columns: [
          {
            Header: translate("messaging.table.companyName"),
            Filter: RecipientFilter,
            id: "recipients.companyName",
            accessor: (d) =>
              join(
                map(d.recipients, (r) => r.companyName),
                ", "
              ),
          },
        ],
      },
      {
        Header: translate("messaging.table.content"),
        columns: [
          {
            Header: translate("messaging.table.subject"),
            accessor: "subject",
            Filter: SubjectFilter,
          },
          {
            Header: translate("messaging.table.body"),
            accessor: "body",
          },
          {
            Header: translate("messaging.table.tags"),
            id: "tags",
            accessor: (d) => join(d.tags, ", "),
            Filter: TagsFilter,
          },
        ],
      },
      {
        Header: translate("messaging.table.actions"),
        columns: [
          {
            Header: (
              <RoundedButton
                light
                noMargin
                onClick={() => setFilters(DEFAULT_FILTERS)}
              >
                <Icon icon={ic_delete} size={16} />
              </RoundedButton>
            ),
            id: "actions",
            accessor: (d) => (
              <StyledLink to={`/user-message/${d.id}`}>Detail</StyledLink>
            ),
          },
        ],
      },
    ];
  }, [translate, SubjectFilter, TagsFilter, RecipientFilter, SenderFilter]);

  return (
    <Zone>
      <H3>Users messages</H3>
      <Datatable
        loading={messages.loading}
        columns={columns}
        data={messages.data}
        total={messages.total}
        showPaginationTop={true}
        onPageSizeChange={(size) => search(0, size, filters)}
        onPageChange={(page) => search(page, messages.pageSize, filters)}
        pageSizeOptions={[50, 100, 200, 500, 1000]}
        pageSize={messages.pageSize}
        page={messages.pageNumber}
      />
    </Zone>
  );
}

export default withLocalization(UserMessages);
