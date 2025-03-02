import React from "react";
import TuitionTransactionList from "./TutionTransactionList";
import { Button } from "flowbite-react";
import ExamTransactionList from "./ExamTransactionsList";

function StudentTransactions() {
  const [activeTab, setActiveTab] = React.useState(0);
  return (
    <div className="px-5">
      <div className="flex flex-col justify-center items-center">
        <Button.Group>
          <Button
            color={activeTab == 0 ? "blue" : "gray"}
            onClick={() => {
              setActiveTab(0);
            }}
          >
            Tuition Transactions
          </Button>
          <Button
            color={activeTab == 1 ? "blue" : "gray"}
            onClick={() => {
              setActiveTab(1);
            }}
          >
            Exam Transactions
          </Button>
        </Button.Group>
      </div>
      {activeTab == 0 ? <TuitionTransactionList /> : <ExamTransactionList />}
    </div>
  );
}

export default StudentTransactions;
