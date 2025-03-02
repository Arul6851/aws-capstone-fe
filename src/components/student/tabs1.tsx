import { Tabs } from "flowbite-react";
import { FaReceipt } from "react-icons/fa";
import { FaBook } from "react-icons/fa";
import { PiExamFill } from "react-icons/pi";
import { ExamFeeProps, TuitionFeeProps } from "@/types/fees";
import TuitionCardList from "../student/TuitionCardList";
import ExamCardList from "../student/ExamCardList";
import TuitionTransactionList from "../student/TutionTransactionList";
import StudentTransactions from "./StudentTransactions";

export function Tabs1({
  examfee,
  tuitionfee,
}: {
  examfee: ExamFeeProps[];
  tuitionfee: TuitionFeeProps[];
}) {
  return (
    <Tabs aria-label="Default tabs">
      <Tabs.Item active title="Tuition Fees" icon={FaBook}>
        <TuitionCardList feetype="Tuition Fees" feesAll={tuitionfee} />
      </Tabs.Item>
      <Tabs.Item title="Exam Fees" icon={PiExamFill}>
        <ExamCardList feetype="Exam Fees" feesAll={examfee} />
      </Tabs.Item>
      <Tabs.Item title="Transactions" icon={FaReceipt}>
        <StudentTransactions />
      </Tabs.Item>
    </Tabs>
  );
}
