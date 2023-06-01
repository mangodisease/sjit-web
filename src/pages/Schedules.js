/* eslint-disable */
import { Row, Col, Card, Button, Table, Modal, Form, Input, DatePicker, notification, Upload, Image, Select, TimePicker } from "antd";
import { getAllSchedules, AddSchedule, UpdateSchedule, getAllTeachers } from "../api";
import { useEffect, useState } from "react";
import logo from "../assets/images/favicon.png"
import { ToTopOutlined } from "@ant-design/icons";
import moment from "moment-timezone";
moment.tz.setDefault("Asia/Manila");
export default function Schedules() {

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

    const columns = [
        
        {
            title: "Schedule",
            render: val => (
                <Row>
                    <Col xs={24}>
                        <span><b>Subject:</b> {val.subject}</span><br />
                        <span><b>Grade:</b> {val.year_level}</span><br />
                        <span><b>Days:</b> {DisplayDate(val)}</span><br />
                        <span><b>Time:</b> {DisplayTime(val)}</span>
                    </Col>
                </Row>
            )
        },
        {
            title: "Teacher",
            render: val => (
                <Row>
                    <Col xs={24} lg={7}>
                        <Image src={`${val.teacher.image}`} width={60} height={60} style={{ borderRadius: 50 }} preview />
                    </Col>
                    <Col xs={24} lg={17}>
                        <span><b>Name: </b> {val.teacher.name}</span> <br />
                        <span><b>Designation:</b> {val.teacher.designation}</span>
                    </Col>
                </Row>
            )
        },
        {
            title: <center>Action</center>,
            render: val => (
                <center>
                    <Row>
                        <Col lg={12} xs={24} style={{ marginBottom: 10 }}>
                            <Button
                                type={"primary"}
                                onClick={() => {
                                    setshowadd(true)
                                    val.time = [moment(val.time[0]), moment(val.time[1])]
                                    setselSched(val)
                                    form.setFieldsValue(val)
                                }}
                            >
                                EDIT
                            </Button>
                        </Col>
                        <Col lg={12} xs={24}>
                            <Button
                                type={"danger"}
                                onClick={() => {

                                }}
                            >
                                REMOVE
                            </Button>
                        </Col>

                    </Row>
                </center>
            )
        },
    ]

    const [list, setlist] = useState(null)
    const [showadd, setshowadd] = useState(false)
    const [selSched, setselSched] = useState(null)

    async function setSchedules() {
        await getAllSchedules()
            .then(res => {
                const data = res.data
                setlist(data.result)
            }).catch(err => {
                console.log(err.message)
                setlist(null)
            })
    }

    useEffect(async () => {
        await setSchedules()
        await setTeachers()
    },
        // eslint-disable-next-line
        [])

    const [form] = Form.useForm()
    const init = {
        "subject": "",
        "course": "",
        "year_level": "",
        "section": "",
        "teacher": [],
        "days": [],
        "time": "",
        "details": ""
    }
    // eslint-disable-next-line
    const [selectedFile, setselectedFile] = useState(null)
    const [selectedFileList, setselectedFileList] = useState([])
    const [imageUrl, setimageUrl] = useState("")

    const [saving, setsaving] = useState(false)
    const [teachers, setteachers] = useState(null)
    const [changeTeacher, setchangeTeacher] = useState(false)

    async function setTeachers() {
        await getAllTeachers()
            .then(res => {
                console.log(res.data.result)
                setteachers(res.data.result)
            }).catch(err => {
                console.log(err.message)
            })
    }
    function clear() {
        setchangeTeacher(false)
        setshowadd(false)
        setselSched(null)
        form.resetFields()
        setimageUrl('')
        setselectedFileList([])
    }

    async function Add(file, values) {
        try {
            await AddSchedule(values)
                .then(res => {
                    console.log(res.data)
                    if (res.data.inserted) {
                        alert("Added Successfully")
                    } else {
                        alert("Unable to add Schedule, Please try again later!")
                    }
                    setsaving(false)
                    clear()
                    setSchedules()
                })
        } catch (err) {
            console.log(err.message)
            setsaving(false)
        }
    }

    async function Update(file, values, selSched) {
        if (file !== null && imageUrl !== "") {
            values.image = imageUrl
        }
        console.log(values)
        if(changeTeacher){
            values.teacher = form.getFieldsValue().teacher
        }
        console.log(values)
        await UpdateSchedule(values, { _id: selSched._id })
            .then(res => {
                if (res.data.updated) {
                    alert("Successfully Updated!")
                    setSchedules()
                    clear()
                } else {
                    alert("Unable to update, Please try again later!")
                }
                setsaving(false)
            }).catch(err => {
                alert(err.message)
                setsaving(false)
            })


    }

    async function Submit(what, values) {
        try {
            setsaving(true)
            console.log(values)
            if (what === "Update") {
                Update(selectedFile, values, selSched)
            } else {
                Add(selectedFile, values)
            }
        } catch (err) {
            console.log(err.message)
            console.log(" here")
        }
    }

    function teacherOptions() {
        try {
            return <>
                {
                    teachers !== null && teachers.map((val, k) => {
                        return <Select.Option value={val._id} key={k} >
                            <Col xs={24}>
                                <img src={val.image} width={20} style={{ borderRadius: 100, marginRight: 10 }} />
                                {val.name}
                            </Col>
                        </Select.Option>
                    })
                }
            </>
        } catch (error) {
            return <></>
        }
    }

    return <>
        <Modal
            title="Add Schedule"
            onCancel={() => {
                setshowadd(false)
                clear()
            }}
            open={showadd}
            footer={[
                <center>
                    <Button
                        type={"danger"}
                        onClick={() => {
                            setshowadd(false)
                            clear()
                        }}
                    >
                        CANCEL
                    </Button>
                    <Button
                        type={"primary"}
                        loading={saving}
                        onClick={() => {
                            form.submit()
                        }}
                    >
                        {
                            selSched === null ? saving ? "SUBMITTING" : "SUBMIT" : saving ? "UPDATING" : "UPDATE"
                        }
                    </Button>
                </center>
            ]}
        >
            <Form
                form={form}
                initialValues={init}
                onFinish={async (values) => {
                    console.log(values)
                    if (selSched === null) {
                        await Submit("Add", values)
                    }
                    //update
                    else {
                        if (imageUrl === "" && selectedFile === null) {
                            //dont update image
                            await Submit("Update", values, false)
                        } else {
                            //update image
                            await Submit("Update", values, true)
                        }
                    }


                }}
                onFinishFailed={err => {
                    console.log(err)
                    notification.warn({
                        message: "Please fill in the from completely!"
                    })
                }}
                alignment="horizontal"
            >
                <Row gutter={[24, 5]}>
                    <Col xs={24}>
                        <Form.Item
                            name="subject"
                            label="Subject"
                            rules={[
                                { required: true, message: "Please fill in this field!" },
                            ]}
                        >
                            <Input type="text" placeholder="Name of Subject" />
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <Form.Item
                            name="course"
                            label="Course"
                            rules={[
                                { required: true, message: "Please fill in this field!" },
                            ]}
                        >
                            <Input type="text" placeholder="Course" />
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <Form.Item
                            name="year_level"
                            label="Grade"
                            rules={[
                                { required: true, message: "Please fill in this field!" },
                            ]}
                        >
                            <Select
                                allowClear
                                style={{
                                    width: '100%',
                                }}
                                placeholder="Please select year level"
                                options={[
                                    {
                                        label: "Grade 11",
                                        value: "Grade 11"
                                    },
                                    {
                                        label: "Grade 12",
                                        value: "Grade 12"
                                    },
                                    {
                                        label: "I",
                                        value: "I"
                                    },
                                    {
                                        label: "II",
                                        value: "II"
                                    },
                                    {
                                        label: "III",
                                        value: "III"
                                    },
                                    {
                                        label: "IV",
                                        value: "IV"
                                    }
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    
                    <Col xs={24}>
                        <Form.Item
                            name="section"
                            label="Section"
                            rules={[
                                { required: true, message: "Please fill in this field!" },
                            ]}
                        >
                            <Input type="text" placeholder="Section" />
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <Form.Item
                            name="teacher"
                            label="Teacher"
                            rules={[
                                { required: true, message: "Please fill in this field!" },
                            ]}
                        >
                            {
                                selSched !== null && changeTeacher===false?
                                    <Col xs={24}>
                                        <img src={selSched.teacher.image} width={20} style={{ borderRadius: 100, marginRight: 10 }} />
                                        {selSched.teacher.name} 
                                        <Button type="link" onClick={()=>{
                                            setchangeTeacher(true)
                                        }}>
                                            Change?
                                        </Button>
                                    </Col>
                                    :
                                selSched !== null && changeTeacher===true?
                                    <>
                                    <Select
                                        allowClear
                                        style={{
                                            width: '100%',
                                        }}
                                        placeholder="Please select a teacher"
                                        //defaultValue={['a10', 'c12']}
                                        onChange={e => {
                                            console.log(e)
                                            form.setFieldValue("teacher", e)
                                        }}
                                    >
                                        {teacherOptions()}
                                    </Select>
                                    <Button type="link" onClick={()=>{
                                        setchangeTeacher(false)
                                        form.setFieldValue("teacher", selSched.teacher._id)
                                    }}>
                                        Cancel
                                    </Button>
                                    </>
                                    :
                                    <Select
                                        allowClear
                                        style={{
                                            width: '100%',
                                        }}
                                        placeholder="Please select a teacher"
                                        //defaultValue={['a10', 'c12']}
                                        onChange={e => {
                                            console.log(e)
                                        }}
                                    >
                                        {teacherOptions()}
                                    </Select>
                            }

                        </Form.Item>


                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            name="days"
                            label="Days"
                            rules={[
                                { required: true, message: "Please fill in this field!" },
                            ]}
                        >
                            <Select
                                mode="multiple"
                                allowClear
                                style={{
                                    width: '100%',
                                }}
                                placeholder="Please select days"
                                //defaultValue={['a10', 'c12']}
                                //onChange={handleChange}
                                options={[
                                    {
                                        label: "Mon",
                                        value: "Mon"
                                    },
                                    {
                                        label: "Tue",
                                        value: "Tue"
                                    },
                                    {
                                        label: "Wed",
                                        value: "Wed"
                                    },
                                    {
                                        label: "Thu",
                                        value: "Thu"
                                    },
                                    {
                                        label: "Fri",
                                        value: "Fri"
                                    },
                                    {
                                        label: "Sat",
                                        value: "Sat"
                                    }
                                ]}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <Form.Item
                            name="time"
                            label="Time"
                            rules={[
                                { required: true, message: "Please fill in this field!" },
                            ]}
                        >
                            <TimePicker.RangePicker
                                placeholder={["hh:mm", "hh:mm"]}
                                format={["hh:mm", "hh:mm"]}
                                status="" style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <Form.Item
                            name="description"
                            label="Details"
                            rules={[
                                { required: false, message: "Please fill in this field!" },
                            ]}
                        >
                            <Input.TextArea type="text" placeholder="" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
        <Row gutter={[24, 5]}>
            <Col xs={24}>

            </Col>
            <Col xs={24}>
                <Card
                    bordered
                    title={
                        <Row gutter={[24, 5]}>\
                            <Col xs={24} lg={17}>
                                <b>List of Schedules</b>
                            </Col>
                            <Col xs={24} lg={6} >
                                <Button
                                    size="small"
                                    onClick={() => {
                                        setshowadd(true)
                                    }}
                                    style={{ float: "right" }}
                                >
                                    Add Schedule
                                </Button>
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