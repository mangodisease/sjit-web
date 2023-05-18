/* eslint-disable */
import { Row, Col, Card, Button, Table, Modal,  Image } from "antd";
import { getStudentEnrolledSchedules,  } from "../api";
import { useEffect, useState } from "react";
import logo from "../assets/images/favicon.png"
import { ToTopOutlined } from "@ant-design/icons";
import TRCam from "./TRCam";

import moment from "moment";

export default function MyClass(props) {
    const { user } = props
    const student_id = user._id
    const [show, setshow] = useState(false)
    const [list, setlist] = useState(null)
    const [what, setwhat] = useState("Time In")
    const [teacher_id, setteacher_id] = useState("")
    const [class_schedule_id, setclass_schedule_id] = useState("")
    const [class_schedule_time, setclass_schedule_time] = useState("")

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

   
    function clear(){
        setshow(false)
        setwhat("Time In")
        setteacher_id("")
        setclass_schedule_id("")
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
        await getStudentEnrolledSchedules(student_id)
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

    function DisplaySched(cs){
        try {
            const dayNow = moment().format("ddd")
            console.log(dayNow)
            return <Row gutter={[24, 0]} style={{ marginBottom: 10 }}>
            {
                cs!==null&&cs.map((val, k)=>{
                    return <Col xs={12} lg={8} hidden={!val.class_schedule.days.includes(dayNow)} key={k} style={{ marginBottom: 10 }}>
                        <Card
                        hoverable
                        style={{  }}
                        actions={[
                            <center><Button type={"primary"} 
                            //style={{float: "right"}}
                            onClick={()=>{
                                setshow(true)
                                setwhat("Time In")
                                setteacher_id(val.teacher._id)
                                setclass_schedule_id(val.class_schedule._id)
                                setclass_schedule_time(val.class_schedule.time[0])
                            }}
                            >
                                Time In
                            </Button></center>
                        ]}
                        >
                            <Row>
                                <Col xs={24} xl={12}>
                                    <b>{val.class_schedule.subject}</b><br/>
                                    <small>{val.teacher.name}</small>
                                </Col>
                                <Col xs={24} xl={12}>
                                    <small style={{ float: "right"}}> {DisplayTime(val.class_schedule)}</small><br/>
                                    <small style={{ float: "right"}}> {DisplayDate(val.class_schedule)}</small><br/>
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
                student_id={student_id}
                teacher_id={teacher_id} 
                class_schedule_id={class_schedule_id}
                class_schedule_time={class_schedule_time}
            />
        </Modal>
        <b>Class Schedule Today</b>
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
                        loading={list===null}
                        dataSource={list}
                    />
                </Card>
            </Col>
        </Row>
    </>
}