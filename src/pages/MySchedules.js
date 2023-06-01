/* eslint-disable */
import { Row, Col, Card, Button, Table, Modal, Form, Input, DatePicker, notification, Upload, Image, Select, TimePicker } from "antd";
import { getTeacherSchedules, getEnrolledStudentsByScheduleAndTeacher } from "../api";
import { useEffect, useState } from "react";
import logo from "../assets/images/favicon.png"
import { ToTopOutlined } from "@ant-design/icons";
import moment from "moment-timezone";
moment.tz.setDefault("Asia/Manila");

export default function MySchedules(props) {
    const { user } = props
    const teacher_id = user._id
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

    const [show, setshow] = useState(false)
    const [students, setstudents] = useState(null)
    const [csT, setcsT] = useState(null)
    function clear(){
        setshow(false)
        setstudents(null)
        setcsT(null)
    }
    const columns = [
        {
            title: "Subject",
            render: val => (
                <span>{val.subject}</span>
            )
        },
        {
            title: "Year Level",
            render: val => (
                <span> {val.year_level}</span>
            )
        },
        {
            title: "Days",
            render: val => (
                <span>{DisplayDate(val)}</span>
            )
        },
        {
            title: "Time",
            render: val => (
            <span>{DisplayTime(val)}</span>
            )
        },
        {
            title: <center>Action</center>,
            render: val => (
            <center>
                <Button
                type="link"
                onClick={async ()=>{
                    setcsT({
                        subject: val.subject,
                        time: DisplayTime(val),
                        date: DisplayDate(val)
                    })
                    setshow(true)
                    await setStudents(val._id, teacher_id)
                }}
                >
                    View Students
                </Button>
            </center>
            )
        }
    ]

    const [list, setlist] = useState(null)

    async function setSchedules() {
        await getTeacherSchedules(teacher_id)
            .then(res => {
                const data = res.data
                setlist(data.result)
            }).catch(err => {
                console.log(err.message)
                setlist(null)
            })
    }

    async function setStudents(cs, t){
        await getEnrolledStudentsByScheduleAndTeacher(cs, t)
        .then(res => {
            const data = res.data
            console.log(data)
            setstudents(data.result)
        }).catch(err => {
            console.log(err.message)
            setstudents(null)
        })
    }

    function DisplaySelected(csT){
        try {
            return  <b>Enrolled Students for {csT.subject}<br/> {csT.date} | {csT.time} </b>
        } catch (err) {
            console.log(err.message)
            return <></>
        }
    }
    useEffect(async () => {
        await setSchedules()
    },
        // eslint-disable-next-line
    [])

    const studentCol = [
        {
            title: "Student",
            render: val => (
                <Row>
                    <Col xs={24} lg={7}>
                        <Image src={`${val.student.image}`} width={60} height={60} style={{ borderRadius: 50 }} preview />
                    </Col>
                    <Col xs={24} lg={17}>
                        <span><b>Name: </b> {val.student.name}</span> <br />
                        <span><b>Birthdate:</b> {moment(val.student.birthdate).format("MM-DD-YYYY")}</span>
                    </Col>
                </Row>
            )
        },
        {
            title: "Course - Level",
            render: val => (
                <span>
                    <b>Course: </b> {val.student.course} <br />
                    <b>Year Level: </b> {val.student.year_level}
                </span>
            )
        },
        {
            title: "Parents",
            render: val => (
                <span>
                    <b>Name: </b>{val.student.parent}
                    <br />
                    <b>Contact #: </b>{val.student.parent_contact}
                </span>
            )
        }
    ]

    return <>
        <Modal
            width={"90%"}
            title={DisplaySelected(csT)}
            onCancel={() => {
                clear()
            }}
            open={show}
            footer={[
               null
            ]}
        >
            <Table
                className="ant-list-box table-responsive"
                columns={studentCol}
                dataSource={students}
                loading={students===null}
            />
        </Modal>
        <Row gutter={[24, 5]}>
            <Col xs={24}>
                <Card
                    bordered
                    title={
                        <Row gutter={[24, 5]}>\
                            <Col xs={24} lg={17}>
                                <b>My Class Schedules</b>
                            </Col>
                        </Row>
                    }
                >
                    <Table
                        className="ant-list-box table-responsive"
                        columns={columns}
                        dataSource={list}
                    />
                </Card>
            </Col>
        </Row>
    </>
}