import {getAllInterviewReports,generateInterviewReport,getInterviewReportById,generateResumePdf} from "../services/interview.api"
import {useContext,useEffect} from  "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"
import Interview from "../pages/Interview"

export const useInterview = ()=>{
    const context = useContext(InterviewContext)
    const {interviewId} = useParams()

    if(!context){
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const {loading, setLoading, report, setReport, reports, setReports} = context

    const generateReport = async ({jobDescription, selfDescription, resumeFile})=>{
        setLoading(true)
        let response = null
        try{
            response = await generateInterviewReport({jobDescription, selfDescription, resumeFile})
            setReport(response.interviewReport)
        }catch(error){
           console.log(error)
        }finally{
            setLoading(false)
        }

        return response.interviewReport
    }

    const getReportById = async (interviewId) =>{
        setLoading(true)
        let response = null
        try{
             response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        }catch(error){
            console.log(error)

        }finally{
            setLoading(false)
        }
        return response.interviewReport
    }

    const getReports = async()=>{
        setLoading(true)
        let response = null
        try{
             response = await getAllInterviewReports()
            setReports(response.interviewReports)
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }

        return response.interviewReports
    }

     const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        const printWindow = window.open("", "_blank")
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head><title>Generating Resume...</title></head>
                    <body style="font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;height:80vh;color:#333;">
                        <div style="text-align:center;">
                            <h2 style="margin-bottom:8px;">AI is crafting your tailored resume...</h2>
                            <p style="color:#666;">Please wait a moment while it formats your document.</p>
                        </div>
                    </body>
                </html>
            `)
        }
        try {
            const response = await generateResumePdf({ interviewReportId })
            
            if (response && response.type === "application/pdf") {
                if (printWindow) printWindow.close()
                const url = window.URL.createObjectURL(new Blob([ response ], { type: "application/pdf" }))
                const link = document.createElement("a")
                link.href = url
                link.setAttribute("download", `resume_${interviewReportId}.pdf`)
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                window.URL.revokeObjectURL(url)
            } else {
                const htmlText = await response.text()
                if (printWindow) {
                    printWindow.document.open()
                    printWindow.document.write(htmlText)
                    printWindow.document.close()
                    printWindow.focus()
                    setTimeout(() => {
                        printWindow.print()
                    }, 500)
                } else {
                    const url = window.URL.createObjectURL(new Blob([ htmlText ], { type: "text/html" }))
                    const link = document.createElement("a")
                    link.href = url
                    link.setAttribute("download", `resume_${interviewReportId}.html`)
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    window.URL.revokeObjectURL(url)
                }
            }
        }
        catch (error) {
            console.error("Resume generation error:", error)
            if (printWindow) printWindow.close()
            alert("Resume generate karne me issue aaya. Please dobara try karein.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
        if(interviewId){
            getReportById(interviewId)
        }else{
            getReports()
        }
    },[interviewId])

    return {loading,report,reports,generateReport,getReportById,getReports,getResumePdf}
}