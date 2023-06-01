/* eslint-disable */
import Webcam from "react-webcam";
import { useState } from "react";
// eslint-disable-next-line
import { Row, Col, notification, Button, Image, Alert } from "antd";
import { isMobile } from "react-device-detect"; 
import axios from "axios";
import moment from "moment";

export default function TRCam(props){
    const { user, student, what, teacher, class_schedule, class_schedule_time} = props
    const uri = true ? "https://sjit-api-wk869.ondigitalocean.app/attendance-check" : "http://localhost:5000/attendance-check"

    const videoConstraints = {
        width: isMobile? "auto" : 500,
        height: isMobile? "auto" : 500,
        facingMode: "user"
      };
      const [predicting, setpredicting] = useState(false)
      const [imgSrc, setimgSrc] = useState("")
      const [result, setresult] = useState(null)
      const dataURLtoFile = (dataurl, filename) => {
        var arr = dataurl.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
    
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
      }
      // eslint-disable-next-line
      const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
          onSuccess("ok");
        }, 0);
      };
      // eslint-disable-next-line
      const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
      };

      const Attend = async (file) => {
        try {
          const val = {
              student_id: student._id, 
              student: student,
              teacher_id: teacher._id,
              subject: class_schedule.subject,
              class_schedule_id: class_schedule._id,
              class_schedule_time: moment(class_schedule_time).format("hh:mm:ss a"), 
              what: what
          }
          console.log(val)
          var formData = new FormData();
          formData.append("File", file);
          formData.append("val", JSON.stringify(val))
          await axios.post(uri, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(res => {
            console.log(res.data)
            setpredicting(false)
            setresult(res.data)
            setTimeout(()=>{
                setresult(null)
            }, 7000)
          }).catch(err => {
            console.log(err.message)
            setresult(null)
            setpredicting(false)
          })
        } catch (err) {
          console.log(err.message)
          setresult(null)
          setpredicting(false)
        }
      }
    return <>
    <Row gutter={[24, 5]}>
        <Col xs={24}>
            {
                result!==null&&
                <Alert message={
                    <center>
                        {result.msg}<br/>
                        <>
                        {
                          result.msg.includes("Successfully Participated!")&&
                          <>
                          {result.time}<br/>
                          {result.name}<br/>
                          <small>with {result.confidence} confidence rate!</small>
                          </>
                        }
                        </>
                    </center>
                }
                type={result.msg.includes("Successfully Participated!")? "success" : "error"}/>
            }
            <center>
                <b>{what}</b><br/><br/>
                {
                    predicting?
                    <Col xs={24}>
                        <Image
                    src={imgSrc}
                    preview={false}
                    width={isMobile? "auto" : 500}
                    height={isMobile? "auto" : 500}
                    />
                    <Button
                          style={{  marginTop: 20, width: "72%", }}
                            loading
                          className='btn btn-success'
                        >
                          Attending Schedule . . .
                        </Button>
                    </Col>
                    :
                    <Webcam
                      audio={false}
                      height={isMobile? "auto" : 500}
                      width={isMobile? "auto" : 500}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                    >
                      {({ getScreenshot }) => (
                        <Button
                          style={{ marginTop: 20, width: "72%", }}

                          onClick={() => {
                            const imageSrc = getScreenshot();

                            setimgSrc(imageSrc)
                            setpredicting(true)
                            const file = dataURLtoFile(imageSrc, "file")
                            console.log(file)
                            Attend(file)

                          }}
                          className='btn btn-success'
                        >
                          Attend
                        </Button>

                      )}
                    </Webcam>
                }
                
            </center>

        </Col>
    </Row>
    </>
}