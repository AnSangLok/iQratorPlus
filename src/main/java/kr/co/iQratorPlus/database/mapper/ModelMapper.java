package kr.co.iQratorPlus.database.mapper;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectProvider;
import org.springframework.stereotype.Repository;

import kr.co.iQratorPlus.model.domain.ModelVO;
import kr.co.iQratorPlus.model.domain.TableVO;
import kr.co.iQratorPlus.model.domain.CalculVO;
import kr.co.iQratorPlus.model.domain.DemoVO;
import kr.co.iQratorPlus.provider.SqlProvider;

@Repository
@Mapper
public interface ModelMapper {
	
	//@@@@모델 관리 쿼리
	//모델명 검색 정보
	public List<ModelVO> selectModelWithName(ModelVO vo);
	//모델 표면적 정보	
	public List<ModelVO> selectModelInfo();
	//모델 상세 정보
	public ModelVO selectModelDetail(ModelVO vo);
	public ModelVO selectWaitModelDetail(ModelVO vo);
	//모델 이력 정보
	public List<HashMap<String,Object>> selectModelHistory(HashMap<String,Object> hm);
	
	public ModelVO selectRequestInfo(ModelVO vo);
	public ModelVO selectWaitRequestInfo(ModelVO vo);
	
	//테이블 목록
	public List<TableVO> selectTableList();
	//테이블 정보
	public List<TableVO> selectTableInfo(TableVO vo);
	
	//적용중인 모델 변경 및 정지, 삭제
	public ModelVO selectLatestDetail(ModelVO vo);
	public void startModelStates(ModelVO vo);
	public void stopModelStates(ModelVO vo);
	public void updateModelStates(ModelVO vo);
	public void updateDetailState(ModelVO vo);
	public void deleteModelHistory(ModelVO vo);
	public void deleteModelOrg(ModelVO vo);
	
	//사용자 입력 쿼리 실행
	@SelectProvider(type = SqlProvider.class, method = "dynamicSql")
	public List<HashMap<String,Object>> excuteQuery(@Param("query") String query, @Param("rows") String rows);
	//숫자체크 쿼리
	@SelectProvider(type = SqlProvider.class, method = "chkNum")
	public List<CalculVO> checkNumber(@Param("query") String query, @Param("columnList") List<TableVO> columnList);
	//데이터의 최대 최소 평균... 계산 쿼리
	@SelectProvider(type = SqlProvider.class, method = "calculQuery")
	public List<CalculVO> calculatateInfo(@Param("query") String query, @Param("columnList") List<TableVO> columnList);
	
	
	//@@@@모델 학습 쿼리
	
	public String latestModelId();
	
	public List<ModelVO> reTrainList();

	public ModelVO selectViewAndDetailList(ModelVO vo);
	
	public ModelVO selectExistDataPath(ModelVO vo);
	
	public int checkModelIdDuplicate(ModelVO vo);
	
	public void insertModelView(ModelVO vo);
	
	public void insertModelDetails(ModelVO vo);
	
	public void updateModelDetails(ModelVO vo);
	
	public void updateTrainCnt(ModelVO vo);
	
	//@@@@모델 실행쿼리
	public List<ModelVO> selectModelInfoAll();
	
	public ModelVO selectFeatures(ModelVO vo);
	
	
	//@@@모델 데모 쿼리
	public int selectFirmCnt(DemoVO vo);
	public List<DemoVO> selectFirmList(DemoVO vo);
	public int selectEmisFirmCnt(DemoVO vo);
	public List<DemoVO> selectEmisFirm(DemoVO vo);
	
}
