package kr.co.iQratorPlus.provider;

import java.util.HashMap;
import java.util.List;

import kr.co.iQratorPlus.model.domain.TableVO;
import kr.co.iQratorPlus.util.TextEdit;

public class SqlProvider {

//    public String dynamicSql(String query, String rows) {
//    	query = query + " FETCH FIRST @@ ROWS ONLY";
//    	query = query.replaceAll("@@", rows);
//        return new StringBuilder()
//            .append(query)
//            .toString();
//    }
	public String dynamicSql(String query, String rows) {
        String trimmedQuery = query == null ? "" : query.trim();
        if (trimmedQuery.endsWith(";")) {
            trimmedQuery = trimmedQuery.substring(0, trimmedQuery.length() - 1);
        }

        if (trimmedQuery.isEmpty()) {
            return trimmedQuery;
        }

        String rowLimit = (rows == null || rows.trim().isEmpty()) ? "0" : rows.trim();

        return new StringBuilder()
            .append("SELECT * FROM (")
            .append(trimmedQuery)
            .append(") WHERE ROWNUM <= ")
            .append(rowLimit)
            .toString();
    }
	
//    public String tableQuery(String query) {
//    	String table = tableName(query);
//    	String returnQuery = "SELECT COLUMN_NAME FROM USER_TAB_COLUMNS WHERE 1=1 AND TABLE_NAME = '" + table + "'";
//    	System.out.println("returnQuery : " + returnQuery);
//        return new StringBuilder()
//                .append(returnQuery)
//                .toString();
//    }
    
    //숫자 여부 체크
    public String chkNum(String query, List<TableVO> columnList) {
    	String returnQuery = "";
    	String regex = "^[+-]?[0-9]*\\.?[0-9]+$";
    	for(int i=0; i<columnList.size(); i++) {
    		returnQuery += 
    				"SELECT '"+columnList.get(i).getColumnName()+"' AS column_name," + 
    				" CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END AS validation_result" + 
    				" FROM ("+ query +")"  +
    				" WHERE NOT REGEXP_LIKE(NVL(\""+columnList.get(i).getColumnName()+"\", ''), '^[+-]?[0-9]*\\.?[0-9]+$')";
    		if(i!=(columnList.size()-1)) {
    			returnQuery += " UNION ALL ";
    		}
    	}
        return new StringBuilder()
                .append(returnQuery)
                .toString();
    }
    
    //데이터의 최대 최소 평균 등등을 계산
    public String calculQuery(String query, List<TableVO> columnList) {
    	String returnQuery = "";
    	for(int i=0; i<columnList.size(); i++) {
    		returnQuery += "SELECT" + 
    				"    '"+columnList.get(i).getColumnName()+"' AS ColumnName," + 
    				"    MIN(CASE WHEN REGEXP_LIKE(\""+columnList.get(i).getColumnName()+"\", '^\\d{4}-\\d{2}-\\d{2}$') THEN TO_CHAR(TO_DATE(\""+columnList.get(i).getColumnName()+"\", 'yyyy-MM-dd'), 'yyyy-MM-dd') WHEN REGEXP_LIKE(\""+columnList.get(i).getColumnName()+"\", '^\\d{2}/\\d{2}/\\d{2}$') THEN TO_CHAR(\""+columnList.get(i).getColumnName()+"\", 'yyyy-MM-dd') WHEN REGEXP_LIKE(\""+columnList.get(i).getColumnName()+"\", '^\\d{4}-\\d{2}-\\d{2}$') THEN TO_CHAR(\""+columnList.get(i).getColumnName()+"\", 'yyyy-MM-dd') ELSE TO_CHAR(\""+columnList.get(i).getColumnName()+"\") END) AS Min," + 
    				"    MAX(CASE WHEN REGEXP_LIKE(\""+columnList.get(i).getColumnName()+"\", '^\\d{4}-\\d{2}-\\d{2}$') THEN TO_CHAR(TO_DATE(\""+columnList.get(i).getColumnName()+"\", 'yyyy-MM-dd'), 'yyyy-MM-dd') WHEN REGEXP_LIKE(\""+columnList.get(i).getColumnName()+"\", '^\\d{2}/\\d{2}/\\d{2}$') THEN TO_CHAR(\""+columnList.get(i).getColumnName()+"\", 'yyyy-MM-dd') WHEN REGEXP_LIKE(\""+columnList.get(i).getColumnName()+"\", '^\\d{4}-\\d{2}-\\d{2}$') THEN TO_CHAR(\""+columnList.get(i).getColumnName()+"\", 'yyyy-MM-dd') ELSE TO_CHAR(\""+columnList.get(i).getColumnName()+"\") END) AS MAX," + 
    				"    COUNT(DISTINCT \""+columnList.get(i).getColumnName()+"\") AS UniqueCnt," + 
    				"    COUNT(*) - COUNT(DISTINCT \""+columnList.get(i).getColumnName()+"\") AS DuplicateCnt," + 
    				"    COUNT(*) - COUNT(\""+columnList.get(i).getColumnName()+"\") AS MissingCnt," + 
    				"    AVG(CASE WHEN REGEXP_LIKE(\""+columnList.get(i).getColumnName()+"\", '^[0-9]+(\\.[0-9]+)?$') THEN TO_NUMBER(\""+columnList.get(i).getColumnName()+"\") ELSE NULL END) AS Mean," + 
    				"    STDDEV(CASE WHEN REGEXP_LIKE(\""+columnList.get(i).getColumnName()+"\", '^[0-9]+(\\.[0-9]+)?$') THEN TO_NUMBER(\""+columnList.get(i).getColumnName()+"\") ELSE NULL END) AS MeanDeviation" + 
    				" FROM ("+ query +")";
//    		" FROM (SELECT \""+columnList.get(i).getColumnName()+"\" FROM "+table+" OFFSET @START@ ROWS FETCH FIRST @ROWS@ ROWS ONLY)";
    		if(i!=(columnList.size()-1)) {
    			returnQuery += " UNION ALL ";
    		}
    	}
        return new StringBuilder()
                .append(returnQuery)
                .toString();
    }
    
//    public String tableName(String query) {
//    	query = query.toUpperCase();
//    	String table = query.split("FROM ")[query.split("FROM ").length-1].split(" ")[0];
//    	System.out.println("table:" + table);
//    	return table;
//    }
}