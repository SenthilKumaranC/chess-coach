import { takeEvery } from "redux-saga/effects"

const SAMPLE = "SAMPLE"
export const sample = (id: string) => ({
  type: SAMPLE,
  payload: id,
})
function* sampleHandler() {}
function* watchForsample() {
  yield takeEvery(SAMPLE, sampleHandler)
}
export default watchForsample
