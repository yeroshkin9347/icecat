import React from "react";
import orderBy from "lodash/orderBy";
import { getByActionIds } from "cdm-shared/services/export";

const dateDiscriminators = ["Current", "All"];

export default function withActionPicking(WrappedComponent, fetchFn) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        exportActions: [],
        failed: false,
      };
      this.fetchActions = this.fetchActions.bind(this);
    }

    fetchActions(actionIds) {
      const f = fetchFn ? fetchFn : getByActionIds;
      return f(actionIds)
        .then((res) => {
          const exportActions = res.data
            ? orderBy(res.data, (t) => t.name.toLowerCase())
            : [];
          this.setState({ exportActions });
          return exportActions;
        })
        .catch((err) => this.setState({ failed: true }));
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          fetchActions={this.fetchActions}
          failedFetchActions={this.state.failed}
          exportActions={this.state.exportActions}
          dateDiscriminators={dateDiscriminators}
        />
      );
    }
  };
}

export { withActionPicking };
