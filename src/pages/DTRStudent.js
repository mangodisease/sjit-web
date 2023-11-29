/* eslint-disable */
import { Col, Row, Modal, Card, Select, Table, Image, Button, Input, Space } from "antd";
import { useEffect, useRef, useState } from "react";
import TRCam from "./TRCam";
import { getEnrolledStudentsBySchedule, getSchedules } from "../api";
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import moment from "moment-timezone";
moment.tz.setDefault("Asia/Manila");

export default function DTRStudent(props){
    const { user, loginAs } = props

    const [students, setstudents] = useState(null)
    const [selStud, setselStud] = useState(null)
    const [schedules, setschedules] = useState(null)
    const [selSched, setselSched] = useState([])
    const [show, setshow] = useState(false)
    const [class_schedule_time, setclass_schedule_time] = useState(null)
    const [schedule, setschedule] = useState(null)
    const [teacher, setteacher] = useState(null)

    function clear(){
        setteacher(null)
        setschedule(null)
        setclass_schedule_time(null)
        setstudents(null)
        setselStud(null)
        setshow(false)
    }

    function DisplayTime(val) {
        try {
            return <>{moment(val.time[0]).format("hh:mm A")} - {moment(val.time[1]).format("hh:mm A")}</>
        } catch (err) {
            console.log(err.message)
            return <></>
        }
    }

    function DisplayDate(val) {
        try {
            return <>{val.days.join(" ")}</>
        } catch (err) {
            console.log(err.message)
            return <></>
        }
    }

    async function SetSchedules(query, select, join){
        await getSchedules(query, select, join)
        .then(res=>{
            const result = res.data.result
            console.log(result)
            setschedules(result)
        }).catch(err=>{
            console.log(err.message)
            setschedules(null)
        })
    }

    useEffect(()=>{
        SetSchedules({ teacher: user._id }, "", "" )
    },
    [])

    function scheduleOptions(sched){
        try {
            return sched!==null&&
            sched.map((val, k)=>{
                return <Select.Option value={JSON.stringify(val)} key={k} >
                                <Col xs={24}>
                                    <b>Subject:</b> {val.subject}<br />
                                    <span><b>Days:</b> {DisplayDate(val)}</span><br />
                                    <span><b>Time:</b> {DisplayTime(val)}</span>
                                </Col>
                            </Select.Option>
            })
        } catch (err) {
            console.log(err.message)
            return <>test</>
        }
    }

    function DisplaySched(selSched){
        try {
            const val = JSON.parse(selSched)
            return <Col xs={24}>
                        <span><b>Subject:</b> {val.subject}</span><br />
                        <span><b>Year Level:</b> {val.year_level}</span><br />
                        <span><b>Days:</b> {DisplayDate(val)}</span><br />
                        <span><b>Time:</b> {DisplayTime(val)}</span>
                </Col>
        } catch (err) {
            console.log(err.message)
            return <></>
        }
    }

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
      };
      const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
      };
      const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
          <div
            style={{
              padding: 8,
            }}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <Input
              ref={searchInput}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
              style={{
                marginBottom: 8,
                display: 'block',
              }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{
                  width: 90,
                }}
              >
                Search
              </Button>
              <Button
                onClick={() => clearFilters && handleReset(clearFilters)}
                size="small"
                style={{
                  width: 90,
                }}
              >
                Reset
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  confirm({
                    closeDropdown: false,
                  });
                  setSearchText(selectedKeys[0]);
                  setSearchedColumn(dataIndex);
                }}
              >
                Filter
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  close();
                }}
              >
                close
              </Button>
            </Space>
          </div>
        ),
        filterIcon: (filtered) => (
          <SearchOutlined
            style={{
              fontSize: 23, fontWeight: 'bolder',
              color: '#1677ff'
            }}
          />
        ),
        onFilter: (value, record) =>
          record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
          if (visible) {
            setTimeout(() => searchInput.current?.select(), 100);
          }
        },
        render: (text) =>
          searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{
                backgroundColor: '#ffc069',
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ''}
            />
          ) : (
            text
          ),
      });
      
    const columns = [
        {
            title: "Student ID",
            dataIndex: 'std_id'
        },
        {
            title: "Student",
            dataIndex: 'name',
            ...getColumnSearchProps('name'),
        },
        {
            title: <center>Action</center>,
            render: val => (
                <center>
                    <Button
                        type={"primary"}
                        onClick={()=>{
                            setshow(true)
                            setselStud(val)
                        }}
                    >
                        ATTEND
                    </Button>
                </center>
            )
        },
    ]

    return<>
        <Row gutter={[24, 5]}>
            {console.log(schedules)}
        <Modal
            width={"90%"}
            title={""}
            onCancel={() => {
                setselStud(null)
                setshow(false)
            }}
            open={show}
            footer={[
               null
            ]}
        >
            <TRCam 
                user={user} 
                what={"Time In"} 
                student={selStud}
                teacher={teacher} 
                class_schedule={schedule}
                class_schedule_time={class_schedule_time}
            />
        </Modal>
            <Col xs={24} lg={12}>
                <Card
                title=""
                bordered
                >
                    <b>Select Schedule: </b>
                    <Select
                    allowClear
                    style={{
                        width: '100%',
                    }}
                    placeholder="Select Schedule"
                    value={selSched}
                    onChange={async e => {
                       try {
                        console.log(e)
                        setselSched(e)
                        if(e!==""){
                            const val = JSON.parse(e)
                            setteacher(val.teacher)
                            setschedule(val)
                            console.log(val)
                            setclass_schedule_time(val.time[0])
                            await getEnrolledStudentsBySchedule({ class_schedule: val._id }, "student", "student")
                            .then(res=>{
                                setstudents(res.data.result)
                            }).catch(err=>{
                                console.log(err.message)
                                setstudents(null)
                            })
                        } else {
                            setteacher(null)
                            setschedule(null)
                            setstudents(null)
                        }
                       } catch (err) {
                        console.log(err.message)
                        setteacher(null)
                        setschedule(null)
                        setstudents(null)
                        setselSched("")
                       }
                    }}
                >
                    {scheduleOptions(schedules)}
                </Select>
                </Card>
            </Col>
            
            <Col xs={24} lg={12}>
                <Card
                bordered
                title={ ""}
                >
                    {
                        DisplaySched(selSched)
                    }
                </Card>
            </Col>

            <Col xs={24} >
                <b>Students</b>
                <Table
                    className="ant-list-box table-responsive"
                    columns={columns}
                    dataSource={students}
                />
            </Col>
        </Row>
    </>
}