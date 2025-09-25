package kr.co.iQratorPlus.dashboard.domain;

import lombok.Data;

@Data
public class DashBoardVO {
	private String modelId;
	private String modelState;
	private int totalCount;
	private int countOfS;
	
	private String algorithmType;
	private int algorithmCnt;
	private String modelViewName;
	private int callApiCnt;
	
	private String detailId;
	private String features;
	private String mse;
	private String rmse;
	private String mape;
	
}




