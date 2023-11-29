/* eslint-disable */
import { Row, Col, Card, Button, Table, Modal, Image } from "antd";
import { getStudentEnrolledSchedules, } from "../api";
import { useEffect, useState } from "react";
import logo from "../assets/images/favicon.png"
import { ToTopOutlined } from "@ant-design/icons";
import TRCam from "./TRCam";

import moment from "moment-timezone";
moment.tz.setDefault("Asia/Manila");

export default function MyClass(props) {
    const { user } = props
    const student = { _id: user._id, name: user.name, parent: user.parent, parent_contact: user.parent_contact }
    const [show, setshow] = useState(false)
    const [list, setlist] = useState(null)
    const [what, setwhat] = useState("Time In")
    const [teacher, setteacher] = useState("")
    const [class_schedule, setclass_schedule] = useState("")
    const [class_schedule_time, setclass_schedule_time] = useState("")

    function DisplayTime(val) {
        try {
            console.log(val)
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

    function clear() {
        setshow(false)
        setwhat("Time In")
        setteacher("")
        setclass_schedule("")
        setclass_schedule_time("")
    }
    const columns = [
        {
            title: "Subject",
            render: val => (
                <span>{val.class_schedule.subject}</span>
            )
        },
        {
            title: "Year Level",
            render: val => (
                <span> {val.class_schedule.year_level}</span>
            )
        },
        {
            title: "Days",
            render: val => (
                <span>{DisplayDate(val.class_schedule)}</span>
            )
        },
        {
            title: "Time",
            render: val => (
                <span>{DisplayTime(val.class_schedule)}</span>
            )
        },
        {
            title: <center>Teacher</center>,
            render: val => (
                <center>
                    {val.teacher.name}
                </center>
            )
        }
    ]

    async function setSchedules() {
        await getStudentEnrolledSchedules(student._id)
            .then(res => {
                const data = res.data
                console.log(data.result)
                setlist(data.result)
            }).catch(err => {
                console.log(err.message)
                setlist(null)
            })
    }

    useEffect(async () => {
        await setSchedules()
    },
        // eslint-disable-next-line
        [])

    function DisplaySched(cs) {
        try {
            const dayNow = moment().format("ddd")
            console.log(dayNow)
            return <Row gutter={[24, 5]} style={{ marginBottom: 10 }}>
                {
                    cs !== null && cs.map((val, k) => {
                        {//hidden={!val.class_schedule.days.includes(dayNow)}
                        }
                        return <Col xs={24} lg={12} xl={8} key={k} style={{ marginBottom: 10 }}>
                            <Card
                                hoverable
                                style={{ padding: 5 }}
                                actions={[
                                    <center>
                                        <Button type={"primary"}
                                            //style={{float: "right"}}
                                            onClick={() => {
                                                setshow(true)
                                                setwhat("Time In")
                                                setteacher(val.teacher)
                                                setclass_schedule(val.class_schedule)
                                                console.log(val.class_schedule.time[0])
                                                setclass_schedule_time(val.class_schedule.time[0])
                                            }}
                                        >
                                            Time In
                                        </Button>
                                    </center>
                                ]}
                            >
                                <Row>
                                    <Col xs={24} xl={12}>
                                        <b>{val.class_schedule.subject}</b><br />
                                        <small>{val.teacher.name}</small>
                                    </Col>
                                    <Col xs={24} xl={12}>
                                        <small style={{ float: "right" }}> {DisplayTime(val.class_schedule)}</small><br />
                                        <small style={{ float: "right" }}> {DisplayDate(val.class_schedule)}</small><br />
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    })
                }
            </Row>
        } catch (err) {
            console.log(err.message)
            return <></>
        }
    }
    return <>
        <Modal
            width={"90%"}
            title={""}
            onCancel={() => {
                clear()
            }}
            open={show}
            footer={[
                null
            ]}
        >
            <TRCam
                user={user}
                what={what}
                student={student}
                teacher={teacher}
                class_schedule={class_schedule}
                class_schedule_time={class_schedule_time}
            />
        </Modal>
        <Col xs={24} style={{ marginBottom: 10 }}>
            <b>Class Schedule Today</b>
        </Col>
        {DisplaySched(list)}
        <Row gutter={[24, 5]}>
            <Col xs={24}>
                <Card
                    bordered
                    title={
                        <Row gutter={[24, 5]}>\
                            <Col xs={24} lg={17}>
                                <b>All My Class Schedules</b>
                            </Col>
                        </Row>
                    }
                >

                    <Table
                        className="ant-list-box table-responsive"
                        columns={columns}
                        loading={list === null}
                        dataSource={list}
                    />
                </Card>
            </Col>
        </Row>
    </>
}