import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { describe, expect, it } from 'vitest';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { routing } from './fines-reports.routes';
import { FINES_REPORTS_CREATE_ROUTING_PATHS } from './constants/fines-reports-create-routing-paths.constant';
import { FINES_REPORTS_ROUTING_PATHS } from './constants/fines-reports-routing-paths.constant';
import { FINES_REPORTS_ROUTING_TITLES } from './constants/fines-reports-routing-titles.constant';
import { finesReportsBusinessUnitsResolver } from './resolvers/fines-reports-business-units/fines-reports-business-units.resolver';
import { finesReportsReportHeadingResolver } from './resolvers/fines-reports-report-heading/fines-reports-report-heading.resolver';
import { finesReportsReportInstanceResolver } from './resolvers/fines-reports-report-instance/fines-reports-report-instance.resolver';
import { finesReportsReportMetadataResolver } from './resolvers/fines-reports-report-metadata/fines-reports-report-metadata.resolver';
import { finesReportsCreateStateGuard } from './guards/fines-reports-create-state-guard/fines-reports-create-state.guard';

describe('finesReports routes', () => {
  it('should redirect bare report routes to the summary list', () => {
    const reportRoute = routing.find((route) => route.path === ':reportTypeId');
    const defaultChildRoute = reportRoute?.children?.find((route) => route.path === '');

    expect(defaultChildRoute).toEqual({
      path: '',
      redirectTo: FINES_REPORTS_ROUTING_PATHS.children.summaryList,
      pathMatch: 'full',
    });
  });

  it('should load the Select business units route', () => {
    const reportRoute = routing.find((route) => route.path === ':reportTypeId');
    const createRoute = reportRoute?.children?.find(
      (route) => route.path === FINES_REPORTS_ROUTING_PATHS.children.create,
    );
    const selectBusinessUnitsRoute = createRoute?.children?.find(
      (route) => route.path === FINES_REPORTS_CREATE_ROUTING_PATHS.children.selectBusinessUnits,
    );

    expect(selectBusinessUnitsRoute).toEqual({
      path: FINES_REPORTS_CREATE_ROUTING_PATHS.children.selectBusinessUnits,
      loadComponent: expect.any(Function),
      canDeactivate: [canDeactivateGuard],
      canActivate: [finesReportsCreateStateGuard],
      data: {
        title: 'Select business units',
      },
      resolve: {
        title: TitleResolver,
        report: finesReportsReportMetadataResolver,
        reportHeading: finesReportsReportHeadingResolver,
        businessUnits: finesReportsBusinessUnitsResolver,
      },
    });
  });

  it('should load the Business unit warning and report parameters routes', () => {
    const reportRoute = routing.find((route) => route.path === ':reportTypeId');
    const createRoute = reportRoute?.children?.find(
      (route) => route.path === FINES_REPORTS_ROUTING_PATHS.children.create,
    );
    const businessUnitWarningRoute = createRoute?.children?.find(
      (route) => route.path === FINES_REPORTS_CREATE_ROUTING_PATHS.children.businessUnitWarning,
    );
    const reportParametersRoute = createRoute?.children?.find(
      (route) => route.path === FINES_REPORTS_CREATE_ROUTING_PATHS.children.reportParameters,
    );

    expect(businessUnitWarningRoute).toEqual({
      path: FINES_REPORTS_CREATE_ROUTING_PATHS.children.businessUnitWarning,
      loadComponent: expect.any(Function),
      canActivate: [finesReportsCreateStateGuard],
      data: {
        title: 'Business unit warning',
        requiresSelectedBusinessUnits: true,
      },
      resolve: {
        title: TitleResolver,
      },
    });
    expect(reportParametersRoute).toEqual({
      path: FINES_REPORTS_CREATE_ROUTING_PATHS.children.reportParameters,
      loadComponent: expect.any(Function),
      canActivate: [finesReportsCreateStateGuard],
      data: {
        title: 'Parameters',
        requiresSelectedBusinessUnits: true,
      },
      resolve: {
        title: TitleResolver,
        reportHeading: finesReportsReportHeadingResolver,
        businessUnits: finesReportsBusinessUnitsResolver,
      },
    });
  });

  it('should resolve the report summary route', () => {
    const reportRoute = routing.find((route) => route.path === ':reportTypeId');
    const reportSummaryRoute = reportRoute?.children?.find(
      (route) => route.path === `${FINES_REPORTS_ROUTING_PATHS.children.reportSummary}/:reportInstanceId`,
    );

    expect(reportSummaryRoute).toEqual({
      path: `${FINES_REPORTS_ROUTING_PATHS.children.reportSummary}/:reportInstanceId`,
      loadComponent: expect.any(Function),
      data: {
        title: FINES_REPORTS_ROUTING_TITLES.children.reportSummary,
      },
      resolve: {
        title: TitleResolver,
        reportSummary: finesReportsReportInstanceResolver,
      },
    });
  });

  it('should resolve summary-list and Select business units business units using report permissions', () => {
    const reportRoute = routing.find((route) => route.path === ':reportTypeId');
    const summaryListRoute = reportRoute?.children?.find(
      (route) => route.path === FINES_REPORTS_ROUTING_PATHS.children.summaryList,
    );
    const createRoute = reportRoute?.children?.find(
      (route) => route.path === FINES_REPORTS_ROUTING_PATHS.children.create,
    );
    const selectBusinessUnitsRoute = createRoute?.children?.find(
      (route) => route.path === FINES_REPORTS_CREATE_ROUTING_PATHS.children.selectBusinessUnits,
    );

    expect(summaryListRoute?.resolve?.['businessUnits']).toBe(finesReportsBusinessUnitsResolver);
    expect(selectBusinessUnitsRoute?.resolve?.['businessUnits']).toBe(finesReportsBusinessUnitsResolver);
  });
});
