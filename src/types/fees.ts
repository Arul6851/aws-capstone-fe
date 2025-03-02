export interface TuitionFeeProps {
  rollno: string;
  name: string;
  dept: string;
  quota: string;
  academic: string;
  tuition: number;
  development: number;
  placement: number;
  others: number;
  paiddate?: string;
  enabled: number;
  paid: number;
  id: string;
}
export interface ExamFeeProps {
  rollno: string;
  name: string;
  dept: string;
  year: string;
  semester: number;
  academic: string;
  exam: number;
  arrear: number;
  others: number;
  paiddate?: string;
  paid: number;
  id: string;
}
export interface TuitionTransactionProps {
  clnt_txn_ref: number;
  rollno: string;
  academicYear: string;
  feeid: string;
  BankTransactionID: string;
  alias_name: string;
  bal_amt: number;
  card_id: string;
  clnt_rqst_meta: string;
  created_at: string;
  hash: string;
  mandate_reg_no: string;
  token: string;
  tpsl_bank_cd: string;
  tpsl_txn_id: string;
  tpsl_txn_time: string;
  txn_amt: number;
  txn_err_msg: string;
  txn_msg: string;
  updatedAt: string;
  txn_status: string;
}
export interface TuitionFeeProps {
  rollno: string;
  name: string;
  dept: string;
  quota: string;
  academic: string;
  tuition: number;
  development: number;
  placement: number;
  others: number;
  paiddate?: string;
  enabled: number;
  paid: number;
  id: string;
}
export interface ExamFeeProps {
  rollno: string;
  name: string;
  dept: string;
  year: string;
  semester: number;
  academic: string;
  exam: number;
  arrear: number;
  others: number;
  paiddate?: string;
  paid: number;
  id: string;
}
export interface ExamTransactionProps {
  clnt_txn_ref: number;
  rollno: string;
  semester: number;
  feeid: string;
  BankTransactionID: string;
  alias_name: string;
  bal_amt: number;
  card_id: string;
  clnt_rqst_meta: string;
  created_at: string;
  hash: string;
  mandate_reg_no: string;
  token: string;
  tpsl_bank_cd: string;
  tpsl_txn_id: string;
  tpsl_txn_time: string;
  txn_amt: number;
  txn_err_msg: string;
  txn_msg: string;
  updatedAt: string;
  txn_status: string;
}
