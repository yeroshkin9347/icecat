import React, { useState, createContext, useContext, useMemo, useEffect } from 'react';
import { Button } from "cdm-ui-components";
import styled from "styled-components";
import Box from "@mui/material/Box";

const TabContent = styled(Box)``;

const TabWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TabContext = createContext();

export const Tabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isTabListExist, setIsTabListExist] = useState(false);

  const renderingChildren = useMemo(() =>
      children.map((child, index) =>
        React.cloneElement(child, { index: index - (isTabListExist ? 1 : 0) })),
    [children, isTabListExist]
  );

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab, setIsTabListExist }}>
      <TabWrapper>{renderingChildren}</TabWrapper>
    </TabContext.Provider>
  );
}

export const TabList = ({ children }) => {
  const { activeTab, setActiveTab, setIsTabListExist } = useContext(TabContext);

  useEffect(() => {
    setIsTabListExist(true);
  }, [setIsTabListExist]);

  const renderingChildren = useMemo(() =>
      children.map((child, index) =>
        React.cloneElement(child, { index, isActive: activeTab === index, onClick: () => setActiveTab(index) })),
    [children, activeTab, setActiveTab]
  );

  return (
    <div>{renderingChildren}</div>
  );
}

export const Tab = ({ children, isActive, onClick }) => {
  return (
    <Button small {...{ [isActive ? "primary" : "light"]: true }} onClick={onClick}>{children}</Button>
  );
}

export const TabPanel = ({ index, children }) => {
  const { activeTab } = useContext(TabContext);

  return (
    <TabContent display={index === activeTab ? "block" : "none"}>
      {children}
    </TabContent>
  );
}
