import "ka-table/style.css";

import { Table } from "ka-table";
import { memo } from "react";

const App = (props) => {
  return <Table rowKeyField={"name"} {...props} />;
};

export default memo(App);
