import {
  Card,
  Col,
  Row,
  Typography,
  Radio,
  Table
} from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import { useState } from "react";

import moment from "moment";

function Home() {
  const { Title } = Typography;

  const onChange = (e) => console.log(`radio checked:${e.target.value}`);

  const [loading, setloading] = useState(false)
  const [list, setlist] = useState(null)

  const count = [
    {
      today: "Student's Time In",
      count: 12,
      icon: "🧑‍🎓",
    },
    {
      today: "Student's Time Out",
      count: 12,
      icon: "🧑‍🎓"
    },
  ];

  const column = [
    {
      width: "15%",
      title: <center>DateTime Log</center>,
      sorter: {
        compare: (a, b) => moment(`${b.datetime}}`) - moment(`${a.datetime}`),
      },
      render: val => (
        <Col style={{ fontSize: 13 }}>
          {moment(`${val.datetime}`).format("MMMM DD, YYYY @ hh:MM A")}
        </Col>
      ),
      key: "datetime"
    },
    {
      width: "20%",
      title: "Student",
      render: val => (
        <center>{val.student}</center>
      )
    },
    {
      width: "30%",
      title: "Strand",
      render: val => (
        <center>{val.strand}</center>
      )
    },
    {
      width: "20%",
      title: "Year Level",
      render: val => (
        <center>{val.yearLevel}</center>
      )
    }
  ]

  return (
    <>
      <div className="layout-content">
        <Row className="rowgap-vbox" gutter={[24, 0]}>
          {count.map((c, index) => (
            <Col
              key={index}
              xs={24}
              sm={24}
              md={12}
              lg={12}
              xl={12}
              className="mb-24"
            >
              <Card bordered={false} className="criclebox ">
                <div className="number">
                  <Row align="middle" gutter={[24, 0]}>
                    <Col xs={18}>
                      <span>{c.today}</span>
                      <Title level={3}>
                        {c.count} <small className={c.bnb}>{ }</small>
                      </Title>
                    </Col>
                    <Col xs={6}>
                      <div className="icon-box">{c.icon}</div>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          ))}
        </Row>



        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={17} className="mb-24">
            <Card bordered={false} className="criclebox cardbody h-full">
              <div className="project-ant">
                <div>
                  <Title level={5}>Attendance Logs</Title>
                  <Paragraph className="lastweek">
                    <span className="blue">{moment().format("MMMM DD, YYYY hh:mm:ss A")}</span>
                  </Paragraph>
                </div>
                <div className="ant-filtertabs">
                  <div className="antd-pro-pages-dashboard-analysis-style-salesExtra">
                    <Radio.Group onChange={onChange} defaultValue="a">
                      <Radio.Button value="all">ALL</Radio.Button>
                      <Radio.Button value="timein">TIME IN</Radio.Button>
                      <Radio.Button value="timeout">TIME OUT</Radio.Button>
                    </Radio.Group>
                  </div>
                </div>
              </div>
                <Table
                  size="small"
                  filterDropdown
                  className="ant-list-box table-responsive bg-white"
                  sorter
                  loading={loading}
                  columns={column}
                  dataSource={list}
                  scroll={null}
                  pagination={{ pageSize: 100, position: ["bottomLeft"] }}
                />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={7} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <div className="timeline-box">
                <Title level={5}>Class Schedule</Title>
                <Paragraph className="lastweek" style={{ marginBottom: 24 }}>
                  for <span className="bnb2">{moment().format("MMMM DD, YYYY")}</span>
                </Paragraph>


              </div>
            </Card>
          </Col>
        </Row>

      </div>
    </>
  );
}

export default Home;
