/* eslint-disable */
import { Row, Col, Card, Button, Table, Modal, Image } from "antd";
import { getAttendanceLogs } from "../api";
import { useEffect, useState } from "react";
import moment from "moment-timezone";
moment.tz.setDefault("Asia/Manila");

export default function AttendanceLogs(props) {
    const { user, loginAs } = props

    const [show, setshow] = useState(false)
    const [list, setlist] = useState(null)
    const [reslist, setreslist] = useState(null)

    const [schedules, setschedules] = useState(null)
    const [teachers, setteachers] = useState(null)

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

    const adminCol = [
        {
            title: "Date/Time Attended",
            render: val => (
                <span>
                    {moment(val.time).format("MMMM DD, YYYY @ hh:mm:ss A")}<br />
                </span>
            )
        },
        {
            title: "Subject/Schedule",
            render: val => (
                <span>
                    {val.class_schedule.subject} |
                    {DisplayDate(val.class_schedule)}<br />
                    {DisplayTime(val.class_schedule)}
                </span>
            )
        },
        {
            title: <center>Student</center>,
            render: val => (
               <center>{val.student!==null? val.student.name : ""}</center>
            )
        },
        {
            title: <center>Teacher</center>,
            render: val => (
                <center>
                    {val.teacher.name}
                </center>
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

    const teacherCol = [
        {
            title: "Date/Time Attended",
            render: val => (
                <span>
                    {moment(val.time).format("MMMM DD, YYYY @ hh:mm:ss A")}<br />
                </span>
            )
        },
        {
            title: "Subject/Schedule",
            render: val => (
                <span>
                    {val.class_schedule.subject} |
                    {DisplayDate(val.class_schedule)}<br />
                    {DisplayTime(val.class_schedule)}
                </span>
            )
        },
        {
            title: <center>Student</center>,
            render: val => (
                <center>
                    {val.student.name}
                </center>
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

    const studentCol = [
        {
            title: "Date/Time Attended",
            render: val => (
                <span>
                    {moment(val.time).format("MMMM DD, YYYY @ hh:mm:ss A")}<br />
                </span>
            )
        },
        {
            title: "Subject/Schedule",
            render: val => (
                <span>
                    {val.class_schedule.subject} |
                    {DisplayDate(val.class_schedule)}<br />
                    {DisplayTime(val.class_schedule)}
                </span>
            )
        },
        {
            title: <center>Teacher</center>,
            render: val => (
                <center>
                    {val.teacher.name}
                </center>
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

    async function setAttendanceLogs() {
        let join = ""
        let query = {}
        if (loginAs === "Admin") {
            join = "student class_schedule teacher"
            query = {}
        } else if (loginAs === "Teacher") {
            join = "class_schedule student"
            query = { teacher: user._id }
        } else if (loginAs === "Student") {
            join = "class_schedule teacher"
            query = { student: user._id }
        } else {
            join = ""
            query = {}
        }
        console.log(query)
        console.log(join)
        await getAttendanceLogs(query, "", join)
            .then(res => {
                const data = res.data
                console.log(data)
                setlist(data.result)
            }).catch(err => {
                console.log(err.message)
                setlist(null)
            })
    }

    useEffect(async () => {
        await setAttendanceLogs()
    },
        // eslint-disable-next-line
        [])


    return <>
        <Row gutter={[24, 5]}>
            <Col xs={24}>
                <Card
                    bordered
                    title={
                        <Row gutter={[24, 5]}>\
                            <Col xs={24} lg={17}>
                                <b>Attendance Logs</b>
                            </Col>
                        </Row>
                    }
                >

                    <Table
                        className="ant-list-box table-responsive"
                        columns={loginAs==="Admin"? adminCol : loginAs==="Teacher"? teacherCol : loginAs==="Student"? studentCol : null}
                        dataSource={list}
                    />
                </Card>
            </Col>
        </Row>
    </>
}