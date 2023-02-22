/* eslint-disable */
import { Row, Col, Card, Button, Table, Modal, Form, Input, DatePicker, notification, Upload, Image } from "antd";
import api from "../api";
import { useEffect, useState } from "react";
import logo from "../assets/images/favicon.png"
import { ToTopOutlined } from "@ant-design/icons";

export default function Students() {

    const columns = [
        {
            title: "Name",
            render: val => (
                <span>{val.name}</span>
            )
        },
        {
            title: "Course - Level",
            render: val => (
                <span>
                    Course: {val.course} <br />
                    Year Level: {val.year_level}
                </span>
            )
        },
        {
            title: "Parent's Contact",
            render: val => (
                <span>
                    {val.parent}
                    <br />
                    {val.parent_contact}
                </span>
            )
        },
    ]

    const [list, setlist] = useState(null)
    const [showadd, setshowadd] = useState(false)

    async function setStudents() {
        await api.getAllStudents()
            .then(res => {
                console.log(res.data)
                const data = res.data
                setlist(data.result)
            }).catch(err => {
                console.log(err.message)
                setlist(null)
            })
    }
    useEffect(async () => {
        await setStudents()
    },
    // eslint-disable-next-line
    [])

    const [form] = Form.useForm()
    const init = {
        "name": "",
        "course": "",
        "year_level": "",
        "birthdate": "",
        "parent": "",
        "parent_contact": ""
    }
    // eslint-disable-next-line
    const [selectedFile, setselectedFile] = useState(null)
    const [selectedFileList, setselectedFileList] = useState([])
    const [imageUrl, setimageUrl] = useState("")

    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const onChange = e => {
        if (e.file.type.includes("image")) {
            switch (e.file.status) {
                case "uploading":
                    setselectedFileList([e.file]);
                    setimageUrl("");
                    console.log("uploading")
                    console.log(e.file)
                    break;
                case "done":
                    console.log(e.file)
                    setselectedFile(e.file.originFileObj);
                    setselectedFileList([e.file]);
                    getBase64(e.file.originFileObj, (url) => {
                        setimageUrl(url);
                    });

                    break;

                default:
                    setimageUrl("");
                    setselectedFile(null);
                    setselectedFileList([]);
            }
        } else {
            notification.info({
                message: "Select an image file only!"
            })
        }

    };

    function clear() {
        setshowadd(false)
        form.resetFields()
        setimageUrl('')
        setselectedFileList([])
    }

    return <>
        <Modal
            title="Add Student"
            onCancel={() => { 
                setshowadd(false)
                clear() }}
            open={showadd}
            onOk={() => {
                form.submit()
            }}
            okText="Submit"
        >
            <Form
                form={form}
                initialValues={init}
                onFinish={values => {
                    console.log(values)
                    
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
                        <center>
                            <Upload
                                fileList={selectedFileList}
                                customRequest={dummyRequest}
                                onChange={e => {
                                    console.log(e)
                                    onChange(e)
                                }}
                            >
                                
                                    <Col xs={24} >
                                        <Image
                                            style={{ pointer: "cursor" }}
                                            width={200}
                                            height={200}
                                            src={imageUrl}
                                            fallback={logo}
                                            preview={false}
                                        />
                                    </Col>
                                
                                <center>
                                    <Button type="link" style={{ color: "black" }} >
                                        <ToTopOutlined style={{ fontSize: 20, color: "green" }} /> {"SELECT AN IMAGE"}
                                    </Button>
                                </center>
                            </Upload>

                        </center>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            name="name"
                            label="Fullname"
                            rules={[
                                { required: true, message: "Please input your fullname!" },
                            ]}
                        >
                            <Input type="text" placeholder="e.g. John Doe" />
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
                            <Input type="text" placeholder="" />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            name="year_level"
                            label="Year Level"
                            rules={[
                                { required: true, message: "Please fill in this field!" },
                            ]}
                        >
                            <Input type="text" placeholder="" />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            name="birthdate"
                            label="Birthdate"
                            rules={[
                                { required: true, message: "Please fill in this field!" },
                            ]}
                        >
                            <DatePicker style={{ width: "100%" }} format={"MM-DD-YYYY"} placeholder="MM-DD-YYYY" />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            name="parent"
                            label="Parent"
                            rules={[
                                { required: true, message: "Please fill in this field!" },
                            ]}
                        >
                            <Input type="text" placeholder="" />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            name="parent_contact"
                            label="Parent Contact"
                            rules={[
                                { required: true, message: "Please input parent contact!" },
                            ]}
                        >
                            <Input type="text" placeholder="e.g.09123456789" />
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
                                <b>List of Students</b>
                            </Col>
                            <Col xs={24} lg={6} >
                                <Button
                                    size="small"
                                    onClick={() => {
                                        setshowadd(true)
                                    }}
                                    style={{ float: "right" }}
                                >
                                    Add Student
                                </Button>
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