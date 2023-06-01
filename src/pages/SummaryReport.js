/* eslint-disable */
import { Row, Col, Card, Button, Table, Modal, Image, Select, DatePicker } from "antd";
import { getAttendanceSummary } from "../api";
import { useEffect, useState } from "react";
import { getSchedules } from "../api";
import { CSVLink } from "react-csv";
import moment from "moment-timezone";
moment.tz.setDefault("Asia/Manila");

export default function SummaryReport(props) {
    const { user, loginAs } = props

    const [schedules, setschedules] = useState(null)
    const [list, setlist] = useState(null)
    const [selSched, setselSched] = useState([])
    const [selDate, setselDate] = useState(null)
    const [present, setpresent] = useState([])
    const [late, setlate] = useState([])

    async function setSchedules() {
        const query = loginAs === "Admin"? {} : { teacher: user._id }
        await getSchedules(query, "", "")
            .then(res => {
                setschedules(res.data.result)
            }).catch(err => {
                console.log(err.message)
                setschedules(null)
            })
    }

    async function setAttendanceSummary(date, query, select, join) {
        console.log(query)
        await getAttendanceSummary(date, query, select, join)
            .then(res => {
                const val = res.data
                setlist(val.result)
                setpresent(val.present)
                setlate(val.late)
                
            }).catch(err => {
                console.log(err.message)
                setlist(null)
            })
    }

    useEffect(async () => {
        await setSchedules()
    },
        []
    )
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

    function ScheduleUI(selSched) {
        try {
            const val = JSON.parse(selSched[0])
            return <Row gutter={[24, 5]}>
                <Col xs={24} lg={12}>
                    <Card>
                        {val.subject} | {DisplayDate(val)} <br />
                        {DisplayTime(val)}
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card>
                        Select Date Summary: {" "}
                        <DatePicker
                            allowClear
                            style={{ width: "100%" }}
                            value={selDate}
                            format={"MM-DD-YYYY"}
                            onChange={async e => {
                                console.log(e)
                                setselDate(e)
                                if (e === null) {
                                    setlist(null)
                                    setlate([])
                                    setpresent([])
                                } else {
                                    await setAttendanceSummary(e, { class_schedule: JSON.parse(selSched)._id }, "", "teacher class_schedule student")
                                }
                            }} />
                    </Card>
                </Col>
                {console.log(selDate)}
            </Row>
        } catch (err) {
            console.log(err.message)
            return <></>
        }
    }

    function schedulesOptions() {
        try {
            return <>
                {
                    schedules !== null && schedules.map((val, k) => {
                        return <Select.Option value={JSON.stringify(val)} key={k} >
                            <Col xs={24}>
                                {val.subject} | {DisplayDate(val)} <br />
                                {DisplayTime(val)}
                            </Col>
                        </Select.Option>
                    })
                }
            </>
        } catch (error) {
            return <></>
        }
    }

    const columns = [
        
        {
            title: "Stud ID",
            render: val => (
                <span>
                    {val.student_id}
                </span>
            )
        },
        {
            title: <center>Student</center>,
            render: val => (
                <center>
                    {val.student}
                </center>
            )
        },
        {
            title: "Date",
            render: val => (
                <span>
                    {val.date}<br />
                </span>
            )
        },
        {
            title: "Time In",
            render: val => (
                <span>
                    {val.timeIn}<br />
                </span>
            )
        },
        {
            title: <center>Remarks</center>,
            render: val => (
                <center>
                    {val.remarks}
                </center>
            )
        }
    ]
    return <Row gutter={[24, 5]}>
        <Col xs={24}>
            <Card
                bordered
                title={
                    <Row gutter={[24, 0]}>\
                        <Col xs={24} lg={17}>
                            <b>Attendance Logs</b>
                        </Col>
                    </Row>
                }
            >
                <Col xs={24} style={{ marginBottom: 10 }}>
                    Choose Class Schedule: {" "}
                    <Select
                        allowClear
                        mode="tags"
                        style={{
                            width: '100%',
                        }}
                        placeholder={"Class Schedules List"}
                        value={selSched}
                        onChange={async e => {
                            if(e.length===0){
                                setselSched(e)
                                setlist(null)
                                setlate([])
                                setpresent([])
                            }
                            else if (e.length > 1) {
                                setselSched([e[0]])
                            } else {
                                setselSched(e)
                            }
                            console.log(e)
                        }}
                    >
                        {schedulesOptions()}
                    </Select>
                </Col>
                {
                    selSched.length > 0 &&
                    <Col xs={24}>
                        {ScheduleUI(selSched)}
                    </Col>
                }
                <b>Summary Report</b>
                <br />
                
                    <Row>
                        <Col xs={24} lg={12}>
                            <center>
                                <b>PRESENT - {present.length}</b>
                            </center>
                        </Col>
                        <Col xs={24} lg={12}>
                            <center>
                                <b>LATE - {late.length}</b>
                            </center>
                        </Col>
                    </Row>
                    <Button type="link">
                        {
                            list!==null?
                            <CSVLink
                                data={list}
                                filename={"summary-report.csv"}
                                className="btn btn-primary"
                                target="_blank"
                                >
                                <b style={{ color: "green" }}>DOWNLOAD CSV</b>
                            </CSVLink>
                            : 
                            <b></b>
                        }
                    </Button>
                    
                <Table
                    className="ant-list-box table-responsive"
                    columns={columns}
                    loading={list === null && selDate!==null}
                    dataSource={list}
                />
            </Card>
        </Col>
    </Row>
}