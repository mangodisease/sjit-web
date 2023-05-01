/* eslint-disable */
import { Row, Col, Card, Button, Table, Modal,  Image } from "antd";
import { getAttendanceLogs } from "../api";
import { useEffect, useState } from "react";


import moment from "moment";

export default function AttendanceLogs(props) {
    const { user } = props
    
    const [show, setshow] = useState(false)
    const [list, setlist] = useState(null)
    

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
    
    async function setAttendanceLogs() {
        await getAttendanceLogs({}, "", "")
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
                        columns={columns}
                        dataSource={list}
                    />
                </Card>
            </Col>
        </Row>
    </>
}