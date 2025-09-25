package kr.co.iQratorPlus.model.domain;

import lombok.Data;

@Data
public class TableVO {
	//테이블 목록
	private String tableName;
	private String columnName;
	private String dataType;
	private String nullAble;
}

