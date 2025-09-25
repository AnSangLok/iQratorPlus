package kr.co.iQratorPlus.model.domain;

import lombok.Data;

@Data
public class CalculVO {
	//테이블 목록
	private String ColumnName;
	private String Min;
	private String Max;
	private int UniqueCnt;
	private int DuplicateCnt;
	private int MissingCnt;
	private String Mean;
	private String MeanDeviation;
	private String ValueType;
	private String message;
	private int validationResult;
	private String errMsg;
}

